export function isURLLL(url, options) {
  (0, _assertString.default)(url);

  if (!url || /[\s<>]/.test(url)) {
    return false;
  }

  if (url.indexOf("mailto:") === 0) {
    return false;
  }

  options = (0, _merge.default)(options, default_url_options);

  if (options.validate_length && url.length >= 2083) {
    return false;
  }

  if (!options.allow_fragments && url.includes("#")) {
    return false;
  }

  if (
    !options.allow_query_components &&
    (url.includes("?") || url.includes("&"))
  ) {
    return false;
  }

  var protocol, auth, host, hostname, port, port_str, split, ipv6;
  split = url.split("#");
  url = split.shift();
  split = url.split("?");
  url = split.shift();
  split = url.split("://");

  if (split.length > 1) {
    protocol = split.shift().toLowerCase();

    if (
      options.require_valid_protocol &&
      options.protocols.indexOf(protocol) === -1
    ) {
      return false;
    }
  } else if (options.require_protocol) {
    return false;
  } else if (url.substr(0, 2) === "//") {
    if (!options.allow_protocol_relative_urls) {
      return false;
    }

    split[0] = url.substr(2);
  }

  url = split.join("://");

  if (url === "") {
    return false;
  }

  split = url.split("/");
  url = split.shift();

  if (url === "" && !options.require_host) {
    return true;
  }

  split = url.split("@");

  if (split.length > 1) {
    if (options.disallow_auth) {
      return false;
    }

    if (split[0] === "") {
      return false;
    }

    auth = split.shift();

    if (auth.indexOf(":") >= 0 && auth.split(":").length > 2) {
      return false;
    }

    var _auth$split = auth.split(":"),
      _auth$split2 = _slicedToArray(_auth$split, 2),
      user = _auth$split2[0],
      password = _auth$split2[1];

    if (user === "" && password === "") {
      return false;
    }
  }

  hostname = split.join("@");
  port_str = null;
  ipv6 = null;
  var ipv6_match = hostname.match(wrapped_ipv6);

  if (ipv6_match) {
    host = "";
    ipv6 = ipv6_match[1];
    port_str = ipv6_match[2] || null;
  } else {
    split = hostname.split(":");
    host = split.shift();

    if (split.length) {
      port_str = split.join(":");
    }
  }

  if (port_str !== null && port_str.length > 0) {
    port = parseInt(port_str, 10);

    if (!/^[0-9]+$/.test(port_str) || port <= 0 || port > 65535) {
      return false;
    }
  } else if (options.require_port) {
    return false;
  }

  if (options.host_whitelist) {
    return checkHost(host, options.host_whitelist);
  }

  if (
    !(0, _isIP.default)(host) &&
    !(0, _isFQDN.default)(host, options) &&
    (!ipv6 || !(0, _isIP.default)(ipv6, 6))
  ) {
    return false;
  }

  host = host || ipv6;

  if (options.host_blacklist && checkHost(host, options.host_blacklist)) {
    return false;
  }

  return true;
}

export function isEmail(str, options) {
  (0, _assertString.default)(str);
  options = (0, _merge.default)(options, default_email_options);

  if (options.require_display_name || options.allow_display_name) {
    var display_email = str.match(splitNameAddress);

    if (display_email) {
      var display_name = display_email[1]; // Remove display name and angle brackets to get email address
      // Can be done in the regex but will introduce a ReDOS (See  #1597 for more info)

      str = str.replace(display_name, "").replace(/(^<|>$)/g, ""); // sometimes need to trim the last space to get the display name
      // because there may be a space between display name and email address
      // eg. myname <address@gmail.com>
      // the display name is `myname` instead of `myname `, so need to trim the last space

      if (display_name.endsWith(" ")) {
        display_name = display_name.substr(0, display_name.length - 1);
      }

      if (!validateDisplayName(display_name)) {
        return false;
      }
    } else if (options.require_display_name) {
      return false;
    }
  }

  if (!options.ignore_max_length && str.length > defaultMaxEmailLength) {
    return false;
  }

  var parts = str.split("@");
  var domain = parts.pop();
  var lower_domain = domain.toLowerCase();

  if (options.host_blacklist.includes(lower_domain)) {
    return false;
  }

  var user = parts.join("@");

  if (
    options.domain_specific_validation &&
    (lower_domain === "gmail.com" || lower_domain === "googlemail.com")
  ) {
    /*
        Previously we removed dots for gmail addresses before validating.
        This was removed because it allows `multiple..dots@gmail.com`
        to be reported as valid, but it is not.
        Gmail only normalizes single dots, removing them from here is pointless,
        should be done in normalizeEmail
      */
    user = user.toLowerCase(); // Removing sub-address from username before gmail validation

    var username = user.split("+")[0]; // Dots are not included in gmail length restriction

    if (
      !(0, _isByteLength.default)(username.replace(/\./g, ""), {
        min: 6,
        max: 30,
      })
    ) {
      return false;
    }

    var _user_parts = username.split(".");

    for (var i = 0; i < _user_parts.length; i++) {
      if (!gmailUserPart.test(_user_parts[i])) {
        return false;
      }
    }
  }

  if (
    options.ignore_max_length === false &&
    (!(0, _isByteLength.default)(user, {
      max: 64,
    }) ||
      !(0, _isByteLength.default)(domain, {
        max: 254,
      }))
  ) {
    return false;
  }

  if (
    !(0, _isFQDN.default)(domain, {
      require_tld: options.require_tld,
    })
  ) {
    if (!options.allow_ip_domain) {
      return false;
    }

    if (!(0, _isIP.default)(domain)) {
      if (!domain.startsWith("[") || !domain.endsWith("]")) {
        return false;
      }

      var noBracketdomain = domain.substr(1, domain.length - 2);

      if (
        noBracketdomain.length === 0 ||
        !(0, _isIP.default)(noBracketdomain)
      ) {
        return false;
      }
    }
  }

  if (user[0] === '"') {
    user = user.slice(1, user.length - 1);
    return options.allow_utf8_local_part
      ? quotedEmailUserUtf8.test(user)
      : quotedEmailUser.test(user);
  }

  var pattern = options.allow_utf8_local_part
    ? emailUserUtf8Part
    : emailUserPart;
  var user_parts = user.split(".");

  for (var _i = 0; _i < user_parts.length; _i++) {
    if (!pattern.test(user_parts[_i])) {
      return false;
    }
  }

  if (options.blacklisted_chars) {
    if (
      user.search(
        new RegExp("[".concat(options.blacklisted_chars, "]+"), "g")
      ) !== -1
    )
      return false;
  }

  return true;
}
