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

import { Link, useParams } from "react-router-dom";

// Examples
import HelloWorldExample from "../../examples/hello-world";
import HelloWorldCanvasExample from "../../examples/hello-world-canvas";
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
    paddingBottom: "0",
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
    "hello-world-canvas": {
      name: "Hello World - Font",
      example: <HelloWorldCanvasExample />,
      srclink: "hello-world-canvas.tsx",
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

function getExampleById(exampleId: string): IMenuItem | undefined {
  for (let group of Object.values(MenuData)) {
    for (let id of Object.keys(group)) {
      if (id === exampleId) {
        return group[id];
      }
    }
  }
}

export default function Examples() {
  const classes = useStyles();
  const params = useParams<{ exampleId: string | undefined }>();

  let example = getExampleById(params.exampleId || "hello-world");
  let defaultExample = MenuData["General"]["hello-world"];

  const [selected, setMenuItem] = useState<IMenuItem>(
    example || defaultExample
  );

  return (
    <div className={classes.layout}>
      <List component="nav" className={classes.root}>
        {Object.entries(MenuData).map(([section, examples]) => (
          <div key={section}>
            <ListItem>
              <ListItemText primary={section} />
            </ListItem>
            <List component="div" disablePadding>
              {Object.entries(examples).map(([id, menuitem]) => (
                <ListItem
                  key={id}
                  component={Link}
                  dense
                  selected={menuitem.name === selected.name}
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
          </div>
        ))}
      </List>

      {selected && (
        <Card className={classes.exampleCard}>
          <CardContent>{selected.example}</CardContent>
          <CardActions
            style={{ float: "right", marginTop: "-15px", marginRight: "5px" }}
          >
            <Button
              // size="small"
              href={`https://github.com/Aedalus/malwoden/tree/master/example-site/src/examples/${selected.srclink}`}
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
