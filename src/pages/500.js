import React from "react";
import ErrorAnimation500 from "../components/ErrorAnimation500";
import { Grid, Box, Typography } from "@material-ui/core";

export default function Custom500() {
  return (
    <div>
      <Box m={4} textAlign="center">
        <ErrorAnimation500 />
        <Grid
          container
          alignItems="center"
          direction="row"
          justify="center"
          wrap="nowrap"
        >
        <Grid item xs={12} s={12} md={6} lg={6} xl={6} justify="center"> 
        <Typography variant="h5" style={{ marginTop: "10px", color: 'rgb(71, 69, 83)' }}>
        "Sorry Dave, I'm afraid I can't do that..."
        </Typography>
        </Grid>
        </Grid>
        <Grid
          container
          alignItems="center"
          direction="row"
          justify="center"
          wrap="nowrap"
          spacing={3}
        >
          <Typography variant="h4" style={{ marginTop: "3%" }}>
            {" "}
            Internal Server Error{" "}
          </Typography>
        </Grid>
        
        <Grid
          container
          alignItems="center"
          spacing={3}
          direction="row"
          justify="center"
          wrap="nowrap"
          spacing={3}
        >
       <Grid item xs={12} s={12} md={5} lg={5} xl={5} justify="center">
          <Typography variant="h6" style={{ marginTop: "10px" }}>
            {" "}
            The server encountered an error and was unable to complete the request. 
            You can try to clear your cache and cookies and try again.
          </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={3}
          alignItems="center"
          direction="row"
          justify="center"
          wrap="nowrap"
        >
        <Grid item xs={12} s={12} md={6} lg={6} xl={6} justify="center">
          <Typography variant="h6" style={{ marginTop: "10px" }}>
            {" "}
            If you still see this error, please contact Support at{" "}
            <a
              href="https://www.cyverse.org"
              style={{ textDecoration: "none" }}
            >
              CyVerse
            </a>
            .
          </Typography>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
