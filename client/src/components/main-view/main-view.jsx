// client/src/main-view/main-view.jsx
import React from 'react';
import axios from 'axios';

import { LoginView } from '../login-view/login-view';
// import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { RegistrationView } from '../registration-view/registration-view';

import { MovieCard } from '../movie-card/movie-card';

export class MainView extends React.Component {

  constructor() {
    super();

    this.state = {
      movies: [],
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
        this.setState({
          movies: response.data
        });
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
    let { movies } = this.state;

    if (movies.length === 0) return <div>The list is empty!</div>;

    return movies.map(movie => <li key={movie._id}>{movie.Title}</li>);
  }








  // render() {
  //   const { movies, selectedMovie, user, register } = this.state;

  //   this.state.user = 'lol';
  //   alert(this.state.user);

  //   if (register) return <RegistrationView onLoggedIn={user => this.onLoggedIn(user)} />

  //   if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} openRegistrationView={() => this.openRegistrationView()} />;

  //   // Before the movies have been loaded
  //   if (!movies) return <div className="main-view" />;

  //   return (
  //     <div className="main-view">
  //       {selectedMovie
  //         ? <MovieView movie={selectedMovie} />
  //         : movies.map(movie => (
  //           <MovieCard key={movie._id} movie={movie} onClick={movie => this.onMovieClick(movie)} />
  //         ))
  //       }
  //     </div>
  //   );
  // }
}