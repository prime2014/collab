import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { connect } from "react-redux";
import { postAPI } from '../services/post/post.service';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { convertDate } from "../utils/convertDate"
import { Link } from "react-router-dom";
import UploadVideo from './UploadVideo';
import { TfiFile, TfiEye } from "react-icons/tfi"


function createData(id, description, video, thumbnail, title, visibility, restrictions, pub_date, views, comments, likes) {
  return {
    id,
    description,
    video,
    thumbnail,
    title,
    visibility,
    restrictions,
    pub_date,
    views,
    comments,
    likes
  };
}

const rows = [
  createData('Cupcake', 305, 3.7, 67, 4.3, 25, 120),
  createData('Donut', 452, 25.0, 51, 4.9, 25, 120),
  createData('Eclair', 262, 16.0, 24, 6.0, 25, 120),
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 25, 120),
  createData('Gingerbread', 356, 16.0, 49, 3.9, 25, 120),
  createData('Honeycomb', 408, 3.2, 87, 6.5, 25, 120),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 25, 120),
  createData('Jelly Bean', 375, 0.0, 94, 0.0, 25, 120),
  createData('KitKat', 518, 26.0, 65, 7.0, 25, 120),
  createData('Lollipop', 392, 0.2, 98, 0.0, 25, 120),
  createData('Marshmallow', 318, 0, 81, 2.0, 25, 120),
  createData('Nougat', 360, 19.0, 9, 37.0, 25, 120),
  createData('Oreo', 437, 18.0, 63, 4.0, 25, 120),
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  let myarr = array.map((el, index)=>{
    return createData(el.id, el.description, el.video, el.thumbnail, el.title, el.state, "---", convertDate(el.pub_date), el.views, 0, el.likes)
  })
  const stabilizedThis = myarr.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'video',
    numeric: false,
    disablePadding: true,
    label: 'Video',
  },
  {
    id: 'visibility',
    numeric: true,
    disablePadding: true,
    label: 'Visibility',
  },
  {
    id: 'restrictions',
    numeric: true,
    disablePadding: true,
    label: 'Restrictions',
  },
  {
    id: 'dates',
    numeric: true,
    disablePadding: true,
    label: 'Dates',
  },
  {
    id: 'views',
    numeric: true,
    disablePadding: true,
    label: 'Views',
  },
  {
    id: 'comments',
    numeric: true,
    disablePadding: true,
    label: 'Comments',
  },
  {
    id: 'likes',
    numeric: true,
    disablePadding: true,
    label: 'Likes (vs Dislikes)',
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell, index, arr) => (
          <TableCell
            sx={{ fontSize: 12, fontWeight:"bold" }}
            colSpan={(headCell.id === "video" && 4) || (headCell.id === "likes" && 3) || 1 }
            key={headCell.id}
            align={headCell.numeric ? 'left' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Videos
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

function TableComponent(props) {
  const [open, setOpen] = React.useState(false);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [videoContent, setVideoContent] = React.useState({})

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  React.useEffect(()=>{

    postAPI.getChannelVideos(0, props.channel.id, rowsPerPage).then(resp=>{
      setVideoContent(resp);
    }).catch(error=>{
      console.log(error)
    })
  },[])



  const handleSelectAllClick = (event) => {
    let rows = videoContent.results.map(item=>
      createData(
        item.id,
        item.description,
        item.video,
        item.thumbnail,
        item.title,
        item.state,
        "---",
        convertDate(item.pub_date),
        item.views,
        0,
        item.likes
      )
    )
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const openModal = (event, row) => {
    event.stopPropagation();
    props.openModal(row);
  }
  const closePostModal = () => setOpen(false);

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleOptions = event => {
    event.stopPropagation();
    alert("Hi there!")
  }

  return (
    <React.Fragment>

    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: "65vw" }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={Object.keys(videoContent).length && videoContent.results.length}
            />
            <TableBody>
              {Object.keys(videoContent).length && stableSort(videoContent.results, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{ fontSize:12, paddingLeft:0 }}
                        colSpan={4}
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="normal"
                      >
                        <div style={{ display:"flex", alignItems:"stretch" }}>
                          <div className={row.visibility === "DRAFT" ? "blurThumb" : "coverImg"} style={{ backgroundSize:"cover", background: `url(${row.thumbnail})`, width:"110px", height:"70px", borderRadius:"5px", backgroundRepeat:"no-repeat", objectFit:"cover" }}></div>
                          <div style={{ padding:"0 10px", display:"flex", flexDirection:"column", alignItems:"stretch", justifyContent:"space-between", height:"calc(100%-10px)" }}>
                            <span style={{ fontWeight:600, fontSize:13 }}>{row.title}</span>
                            <div>
                              <span style={{ fontSize:16 }} className="pi pi-pencil"></span>
                              <span style={{ fontSize:16, marginLeft:20 }} className="pi pi-ellipsis-v"></span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell sx={{ fontSize: 12, paddingLeft:0 }} colSpan={1} align="left">{row.visibility === "DRAFT" ? <div style={{ fontWeight:600, display:"flex", justifyContent:"left", alignItems:"center" }}><TfiFile className="paperIcon" style={{ padding:0, margin:0, marginRight:"5px" }} /> {row.visibility} </div> : <div style={{ fontWeight:600, display:"flex", justifyContent:"left", alignItems:"center" }}><TfiEye className="paperIcon" style={{ padding:0, margin:0, marginRight:"5px", color:"green" }} /> {row.visibility} <ArrowDropDownOutlinedIcon className="paperIcon" /></div>}</TableCell>
                      <TableCell sx={{ fontSize: 12, paddingLeft:0 }} colSpan={1} align="left">{row.restrictions}</TableCell>
                      <TableCell sx={{ fontSize: 12, paddingLeft:0 }} colSpan={1} align="left"><b>{row.visibility === "DRAFT" ? "" : row.pub_date}</b></TableCell>
                      <TableCell sx={{ fontSize: 12, paddingLeft:0 }} colSpan={1} align="left">{row.visibility === "DRAFT" ? "" : row.views}</TableCell>
                      <TableCell sx={{ fontSize: 12, paddingLeft:0 }} colSpan={1} align="left">{row.visibility === "DRAFT" ? "" : row.comments}</TableCell>
                      <TableCell sx={{ fontSize: 12, paddingLeft:0 }} colSpan={3} align="left">{row.visibility === "DRAFT" ? <span onClick={(event) => openModal(event, row)} className='editDraft' style={{ color:"#065FDA", fontSize:14, fontWeight:"bold" }}>EDIT DRAFT</span> : row.likes}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={7} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={Object.keys(videoContent).length && videoContent.results.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

    </Box>
    </React.Fragment>
  );
}

const mapStateToProps = state => {
  return {
    user: state.userReducer.credentials,
    channel: state.channelReducer.channel
  }
}

export default connect(mapStateToProps, null)(TableComponent);
