import {FunctionComponent, useContext, useEffect, useState} from 'react';
import List from '@material-ui/core/List';
import {ListItem, Box, Typography, ListItemProps} from '@material-ui/core';
import {
  buildResultList,
  Result,
  buildResultTemplatesManager,
  ResultTemplatesManager,
  ResultList as HeadlessResultList,
} from '@coveo/headless';
import EngineContext from '../common/engineContext';

type Template = (result: Result) => React.ReactNode;

interface FieldValueInterface {
  value: string;
  caption: string;
}

interface ResultListProps {
  controller: HeadlessResultList;
}
function ListItemLink(props: ListItemProps<'a'>) {
  return (
    <ListItem {...props} button component="a">
      <Typography variant="body1" color="primary">
        {props.title}
      </Typography>
    </ListItem>
  );
}

function FieldValue(props: FieldValueInterface) {
  return (
    <Box>
      <Typography
        color="textSecondary"
        style={{fontWeight: 'bold'}}
        variant="caption"
      >
        {props.caption}:&nbsp;
      </Typography>
      <Typography color="textSecondary" variant="caption">
        {props.value}
      </Typography>
    </Box>
  );
}

const ResultListRenderer: FunctionComponent<ResultListProps> = (props) => {
  const {controller} = props;
  const engine = useContext(EngineContext)!;
  const [state, setState] = useState(controller.state);

  const headlessResultTemplateManager: ResultTemplatesManager<Template> =
    buildResultTemplatesManager(engine);

  headlessResultTemplateManager.registerTemplates({
    conditions: [],
    content: (result: Result) => (
      <ListItem disableGutters key={result.uniqueId}>
        <Box my={2}>
          <Box pb={1}>
            <ListItemLink
              disableGutters
              title={result.title}
              href={result.clickUri}
            />
          </Box>

          {result.excerpt && (
            <Box pb={1}>
              <Typography color="textPrimary" variant="body2">
                {result.excerpt}
              </Typography>
            </Box>
          )}
         
          {result.raw.code_origin && (
            <FieldValue caption="Origin" value={result.raw.code_origin} />
          )}
          {result.raw.code_org && (
            <FieldValue caption="Org" value={result.raw.code_org} />
          )}
          {result.raw.code_repo && (
            <FieldValue caption="Repo" value={result.raw.code_repo} />
          )}
          {result.raw.code_branch && (
            <FieldValue caption="Branch" value={result.raw.code_branch} />
          )}
        </Box>
      </ListItem>
    ),
  });

  useEffect(
    () => controller.subscribe(() => setState(controller.state)),
    [controller]
  );

  return (
    <List>
      {state.results.map((result: Result) => {
        const template = headlessResultTemplateManager.selectTemplate(result);
        return template ? template(result) : null;
      })}
    </List>
  );
};

const ResultList = () => {
  const engine = useContext(EngineContext)!;
  const controller = buildResultList(engine);
  return <ResultListRenderer controller={controller} />;
};

export default ResultList;
