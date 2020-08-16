import React, { useState, useEffect } from "react";
import axios from "axios";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Link } from "react-router-dom";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import { withStyles, makeStyles } from "@material-ui/core/styles";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const Movies = () => {
  const [pageNum, setPageNum] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [movies, setMovies] = useState([]);
  const [searchFieldValue, setSearchFieldValue] = useState("Pokemon");
  const [searchKey, setSearchKey] = useState(searchFieldValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      const res = await axios.get(
        "http://www.omdbapi.com/?apikey=a7f0a0ef&type=movie&r=json&s=" +
          searchKey
      );
      if (res.data.Response === "True") {
        let data = res.data.Search;
        const sortedData = data.sort((a, b) => b.Year - a.Year);
        setMovies(sortedData);
      } else {
        setMovies([]);
      }
      setLoaded(true);
    };

    fetchMovies();
  }, [searchKey]);

  const handleChangePage = (e, newPage) => {
    setPageNum(newPage);
  };

  const searchMovies = () => {
    if (searchKey !== searchFieldValue) {
      setLoaded(false);
    }
    setPageNum(0);
    setSearchKey(searchFieldValue);
  };
  return (
    <Paper className="moviesContainer">
      <div className="searchContainer">
        <TextField
          placeholder="Search movies..."
          value={searchFieldValue}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              searchMovies();
            }
          }}
          onChange={(e) => setSearchFieldValue(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </div>
      <TableContainer>
        {loaded ? (
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell align="left">Id</StyledTableCell>
                <StyledTableCell align="left">Title</StyledTableCell>
                <StyledTableCell align="left">Year</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {movies.length ? (
                movies.slice(pageNum * rowsPerPage, pageNum * rowsPerPage + rowsPerPage).map((row, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell align="left">
                        {row.imdbID}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Link to={{ pathname: `/details/${row.imdbID}` }}>
                          {row.Title}
                        </Link>
                      </StyledTableCell>
                      <StyledTableCell align="left">{row.Year}</StyledTableCell>
                    </StyledTableRow>
                  ))
              ) : (
                <tr>
                  <th className="notFoundMsg">No movies found !</th>
                </tr>
              )}
            </TableBody>
          </Table>
        ) : (
          <CircularProgress />
        )}
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={movies.length}
        rowsPerPage={rowsPerPage}
        page={pageNum}
        onChangePage={handleChangePage}
      />
    </Paper>
  );
};

export default Movies;