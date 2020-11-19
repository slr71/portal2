import React from "react";
import ErrorAnimation from "../components/ErrorAnimation";
import { Grid, Box, Typography } from "@material-ui/core";

export default function Custom404() {
  return (
    <div>
      <Box>
        <ErrorAnimation />
        <Grid
          container
          alignItems="center"
          direction="row"
          justify="center"
          wrap="nowrap"
        >
        <Grid item xs={12} >
          <Typography variant="h4" align="center" style={{ marginTop: "3%" }}>
            {" "}
            <strong> Whoops!</strong> Page Not Found{" "}
          </Typography>
        </Grid>
        </Grid>
        <Grid
          container
          alignItems="center"
          direction="row"
          justify="center"
          wrap="nowrap"
        >
          <Typography variant="h6" style={{ marginTop: "10px" }}>
            {" "}
            Looks like we got a little lost in space.
          </Typography>
        </Grid>
        <Grid
          container
          alignItems="center"
          direction="row"
          justify="center"
          wrap="nowrap"
        >
          <Typography variant="h6" style={{ marginTop: "10px" }}>
            {" "}
            Let's get you back to{" "}
            <a
              href="https://www.cyverse.org"
              style={{ textDecoration: "none" }}
            >
              CyVerse
            </a>
            .
          </Typography>
        </Grid>
      </Box>
    </div>
  );
}
