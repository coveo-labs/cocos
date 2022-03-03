import {Grid, Typography} from '@material-ui/core';
import React from 'react';
import './Hero.css';

interface IHeroProps {
  logos: string[];
  welcome: string;
}

function Anchor(props: React.HTMLProps<HTMLAnchorElement>) {
  return <a href={props.href}>{props.value}</a>;
}

const Hero: React.FunctionComponent<IHeroProps> = (props) => {
  return (
    <header className="App-header">
      <Grid className="logo-container">
        {props.logos.map((logo, idx) => (
          <img
            src={logo}
            key={'image-' + idx}
            className="App-logo"
            alt="logo"
          />
        ))}
      </Grid>

      <Typography variant="h5">{props.welcome}</Typography>
      <Typography variant="body2" className="subtitle">
        This sample search page was built with{' '}
        <Anchor
          href="https://material-ui.com/getting-started/installation"
          value="Material-ui"
        />{' '}
        and the{' '}
        <Anchor
          href="https://docs.coveo.com/en/headless"
          value="Coveo Headless Library"
        />
        .<br></br>
      </Typography>
    
    </header>
  );
};

export default Hero;
