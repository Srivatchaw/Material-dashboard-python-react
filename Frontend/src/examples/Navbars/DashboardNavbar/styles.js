function navbar(theme, ownerState) {
  const { palette, boxShadows, transitions, functions } = theme;
  const { transparentNavbar, absolute, light, darkMode } = ownerState;

  const { dark, white, text, transparent, gradients } = palette;
  const { navbarBoxShadow } = boxShadows;
  const { rgba, pxToRem } = functions;

  return {
    boxShadow: transparentNavbar || absolute ? "none" : navbarBoxShadow,
    backdropFilter: transparentNavbar || absolute ? "none" : `saturate(200%) blur(${pxToRem(30)})`,
    backgroundColor:
      transparentNavbar || absolute
        ? transparent.main
        : rgba(darkMode ? dark.main : white.main, 0.8),
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
    // NEW: Ensure zIndex is high enough to be on top
    zIndex: theme.zIndex.appBar + 1, // Add zIndex
    minHeight: pxToRem(65), // Default height, adjust as needed

    // For fixed position, ensure it spans full width
    width: "100%",
    top: 0,
    left: 0,
    right: 0,
  };
}

function navbarContainer(theme) {
  const { pxToRem } = theme.functions;

  return {
    flexGrow: 1,
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: pxToRem(65), // Consistent height
    [theme.breakpoints.up("md")]: {
      paddingRight: pxToRem(24),
      paddingLeft: pxToRem(24),
    },
  };
}

function navbarRow(theme, ownerState) {
  const { pxToRem } = theme.functions;
  const { isMini } = ownerState;

  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%", // Take full width

    [theme.breakpoints.up("md")]: {
      paddingRight: pxToRem(8),
      // Removed isMini specific padding
      // justifyContent: isMini ? "space-between" : "stretch",
    },

    "& .MuiBox-root": {
      // Apply to MDBox inside
      display: "flex",
      alignItems: "center",
    },
  };
}

function navbarIconButton(theme) {
  const { pxToRem } = theme.functions;

  return {
    padding: pxToRem(8),
    "& .MuiSvgIcon-root": {
      fontSize: pxToRem(20),
    },
  };
}

function navbarMobileMenu(theme) {
  const { pxToRem } = theme.functions;

  return {
    display: "inline-block",
    lineHeight: 0,
    [theme.breakpoints.up("xl")]: {
      display: "none",
    },
    "& .MuiSvgIcon-root": {
      fontSize: pxToRem(28),
      marginRight: pxToRem(4),
    },
  };
}

export { navbar, navbarContainer, navbarRow, navbarIconButton, navbarMobileMenu };
