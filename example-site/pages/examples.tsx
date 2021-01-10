import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import Layout from "../components/layout";

// Examples
import HelloWorldExample from "../examples/hello-world";
import BasicGameExample from "../examples/basic-game";

import BasicFOVExample from "../examples/fov/basic-fov";
import CellularAutomataExample from "../examples/generation/cellular";
import DrunkardsWalkExample from "../examples/generation/drunkards-walk";

import MouseInputExample from "../examples/input/mouse-input";
import MouseInputFontExample from "../examples/input/mouse-input-font";
import MouseInputFont from "../examples/input/mouse-input-font";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 250,
    backgroundColor: theme.palette.background.paper,
    borderRight: "1px solid #ddd",
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  layout: {
    display: "flex",
  },
  exampleCard: {
    marginLeft: "20px",
    marginTop: "20px",
  },
}));

interface IMenuData {
  [index: string]: {
    [index: string]: JSX.Element;
  };
}
const MenuData: IMenuData = {
  General: {
    "Hello World": <HelloWorldExample />,
    "Basic Game": <BasicGameExample />,
  },
  Input: {
    Mouse: <MouseInputExample />,
    "Mouse - Font": <MouseInputFont />,
  },
  FOV: {
    "Basic FOV": <BasicFOVExample />,
  },
  Generation: {
    "Cellular Automata": <CellularAutomataExample />,
    "Drunkards Walk": <DrunkardsWalkExample />,
  },
};

export default function Examples() {
  const classes = useStyles();

  const [Example, setExample] = useState(<HelloWorldExample />);

  return (
    <Layout>
      <div className={classes.layout}>
        <List component="nav" className={classes.root}>
          {Object.entries(MenuData).map(([section, examples]) => (
            <>
              <ListItem>
                <ListItemText primary={section} />
              </ListItem>
              <List component="div" disablePadding>
                {Object.entries(examples).map(([example, component]) => (
                  <ListItem
                    button
                    className={classes.nested}
                    onClick={() => {
                      setExample(component);
                    }}
                  >
                    <ListItemText primary={example} />
                  </ListItem>
                ))}
              </List>
              <Divider />
            </>
          ))}
        </List>
        {Example && (
          <Card className={classes.exampleCard}>
            <CardContent>{Example}</CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
