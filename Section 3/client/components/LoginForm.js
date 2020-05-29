import React, { Component } from 'react';
import AuthForm from './AuthForm';
import query from '../queries/CurrentUser'
import mutation from '../mutations/Login';
import { graphql } from 'react-apollo';

class LoginForm extends Component {

    constructor(props) {
        super(props)
        this.state = { errors: [] }
    }

    onSubmit({ email, password }) {
        this.props.mutate({
            variables: { email, password },
            // When this comes back, this query response updates every component that uses this query. In this case, the Header component automatically updaates.
            refetchQueries: [{ query }],
        }).catch((res) => {
            const errors = res.graphQLErrors.map(error => error.message);
            this.setState({ errors });
        });
    }

    render() {
        return (
            <div>
                <h3>Login</h3>
                <AuthForm
                    errors={this.state.errors}
                    onSubmit={this.onSubmit.bind(this)}
                />
            </div>
        );
    }
}

export default graphql(mutation)(LoginForm);
