import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import Github from "@material-ui/icons/GitHub";

import "fontsource-roboto";
// import "normalize.css";

const useStyles = makeStyles((theme) => ({
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {},
  link: {
    margin: theme.spacing(1, 1.5),
  },
}));

export default function ButtonAppBar() {
  const classes = useStyles();

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      className={classes.appBar}
    >
      <Toolbar>
        <Link href="/">
          <Typography variant="h6" color="inherit" noWrap>
            MALWODEN
          </Typography>
        </Link>

        <div style={{ flexGrow: 1 }} />
        <nav>
          <Link
            variant="button"
            color="textPrimary"
            href="/examples"
            className={classes.link}
          >
            Examples
          </Link>
          <Link
            variant="button"
            color="textPrimary"
            href="https://docs.malwoden.com"
            className={classes.link}
          >
            TypeDocs
          </Link>
        </nav>

        <IconButton color="inherit" href="https://github.com/Aedalus/malwoden">
          <Github />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
