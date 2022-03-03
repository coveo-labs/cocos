import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Facet from './Facet';

const FacetList = () => {
  return (
    <Box>
      <Box px={1} pb={1}>
        <Typography variant="overline">Refine By</Typography>
        <Facet field="code_extension" title="File Type" />
        <Facet field="code_origin" title="Origin" />
        <Facet field="code_org" title="Org" />
        <Facet field="code_repo" title="Repo" />
        <Facet field="code_branch" title="Branch" />
      </Box>
    </Box>
  );
};

export default FacetList;
