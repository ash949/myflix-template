// client/src/main-view/main-view.jsx
import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


import { LoginView } from '../login-view/login-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { RegistrationView } from '../registration-view/registration-view';

import { setMovies, setFilter } from '../../actions/actions';

export class MainView extends React.Component {

  constructor() {
    super();

    this.state = {
      movies: null,
      selectedMovie: null,
      user: null,
      register: false
    };
  }

  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getMovies(accessToken);
    }
  }

  onMovieClick(movie) {
    this.setState({
      selectedMovie: movie
    });
  }

  getMovies(token) {
    axios.get('http://localhost:8080/movies', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        // Assign the result to the state
        // this.setState({
        //   movies: response.data
        // });
        this.props.setMovies(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.Username
    });

    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token);
  }

  openRegistrationView() {
    this.setState({
      register: true
    });
  }

  render() {
    let { movies } = this.props;
    const { selectedMovie, user, register } = this.state;

    if (register) return <RegistrationView onLoggedIn={user => this.onLoggedIn(user)} />

    if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} openRegistrationView={() => this.openRegistrationView()} />;

    // Before the movies have been loaded
    if (!movies) return <div className="main-view" />;

    return (
      <div className="main-view">
        {selectedMovie
          ? <MovieView movie={selectedMovie} />
          : movies.map(movie => (
            <MovieCard key={movie._id} movie={movie} onClick={movie => this.onMovieClick(movie)} />
          ))
        }
      </div>
    );
  }
}

let mapStateToProps = state => {
  return {
    movies: state.movies,
    test: '123'
  }
}

let mapDispatchToProps = {
  setMovies
}

// #4
export default connect(mapStateToProps, mapDispatchToProps)(MainView);

MainView.propTypes = {
  test: PropTypes.string.isRequired,
  setMovies: PropTypes.func.isRequired
}