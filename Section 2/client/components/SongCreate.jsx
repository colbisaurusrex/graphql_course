import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Link, hashHistory } from 'react-router';
import query from '../queries/fetchSongs';

class SongCreate extends Component {
    constructor(props) {
        super(props);
        this.state = { title: '' };
        this.onSubmit = this.onSubmit.bind(this)
    }

    onSubmit(event) {
        event.preventDefault();
        return this.props.mutate({
            variables:  { title: this.state.title },
            // This is somewhat inefficient because it makes another request to the backend. Using dataIdFromObject is more performant.
            refetchQueries: [{ query }]
        })
        .then(() => hashHistory.push('/'));
    }

    render() {
        return (
            <div>
                <Link to="/">Back</Link>
                <h3>Create a New Song</h3>
                <form onSubmit={this.onSubmit}>
                    <label>Song Title:</label>
                    <input
                        value={this.state.title}
                        onChange={event => this.setState({ title: event.target.value })}
                    />
                </form>
            </div>
        );
    }
}

const mutation = gql`
    mutation AddSong($title: String){
        addSong(title: $title) {
            id
            title
        }
    }
`;

export default graphql(mutation)(SongCreate);