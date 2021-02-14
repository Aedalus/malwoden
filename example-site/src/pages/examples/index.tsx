import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import GitHubIcon from "@material-ui/icons/GitHub";

import { Link } from "react-router-dom";

// Examples
import HelloWorldExample from "../../examples/hello-world";
import BasicGameExample from "../../examples/basic-game";

import BasicFOVExample from "../../examples/fov/basic-fov";
import CellularAutomataExample from "../../examples/generation/cellular";
import DrunkardsWalkExample from "../../examples/generation/drunkards-walk";

import MouseInputExample from "../../examples/input/mouse-input";
import MouseInputFontExample from "../../examples/input/mouse-input-font";

import AStarExample from "../../examples/pathfinding/astar";
import DijkstraExample from "../../examples/pathfinding/dijkstra";

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
    height: "100%",
  },
}));

interface IMenuData {
  [index: string]: {
    [index: string]: IMenuItem;
  };
}

interface IMenuItem {
  name: string;
  example: JSX.Element;
  srclink: string;
}

const MenuData: IMenuData = {
  General: {
    "hello-world": {
      name: "Hello World",
      example: <HelloWorldExample />,
      srclink: "hello-world.tsx",
    },
    "basic-game": {
      name: "Basic Game",
      example: <BasicGameExample />,
      srclink: "basic-game.tsx",
    },
  },
  Input: {
    mouse: {
      name: "Mouse",
      example: <MouseInputExample />,
      srclink: "input/mouse-input.tsx",
    },
    "mouse-font": {
      name: "Mouse - Font",
      example: <MouseInputFontExample />,
      srclink: "input/mouse-input-font.tsx",
    },
  },
  FOV: {
    "basic-fov": {
      name: "Basic FOV",
      example: <BasicFOVExample />,
      srclink: "fov/basic-fov.tsx",
    },
  },
  Generation: {
    "cellular-automata": {
      name: "Cellular Automata",
      example: <CellularAutomataExample />,
      srclink: "generation/cellular.tsx",
    },
    "drunkards-walk": {
      name: "Drunkard's Walk",
      example: <DrunkardsWalkExample />,
      srclink: "generation/drunkards-walk.tsx",
    },
  },
  Pathfinding: {
    "a-star": {
      name: "AStar",
      example: <AStarExample />,
      srclink: "pathfinding/astar.tsx",
    },
    dijkstra: {
      name: "Dijkstra",
      example: <DijkstraExample />,
      srclink: "pathfinding/dijkstra.tsx",
    },
  },
};

export default function Examples() {
  const classes = useStyles();

  const [selected, setMenuItem] = useState<IMenuItem>(
    MenuData["General"]["hello-world"]
  );

  return (
    <div className={classes.layout}>
      <List component="nav" className={classes.root}>
        {Object.entries(MenuData).map(([section, examples]) => (
          <>
            <ListItem>
              <ListItemText primary={section} />
            </ListItem>
            <List component="div" disablePadding>
              {Object.entries(examples).map(([id, menuitem]) => (
                <ListItem
                  component={Link}
                  to={`/examples/${id}`}
                  button
                  className={classes.nested}
                  onClick={() => {
                    setMenuItem(menuitem);
                  }}
                >
                  <ListItemText primary={menuitem.name} />
                </ListItem>
              ))}
            </List>
            <Divider />
          </>
        ))}
      </List>

      {selected && (
        <Card className={classes.exampleCard}>
          <CardContent>{selected.example}</CardContent>
          <CardActions>
            <Button
              size="small"
              href={`https://github.com/Aedalus/malwoden/tree/master/example-site/examples/${selected.srclink}`}
              endIcon={<GitHubIcon />}
            >
              View Source
            </Button>
          </CardActions>
        </Card>
      )}
    </div>
  );
}
