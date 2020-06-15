import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { hashHistory } from 'react-router';
import AuthForm from './AuthForm';
import query from '../queries/CurrentUser.js'
import mutation from '../mutations/Login.js';

class LoginForm extends Component {

    constructor(props) {
        super(props)
        this.state = { errors: [] }
    }

    componentWillUpdate(nextProps) {
        console.log(this.props, nextProps)
        const { data: { user } } = this.props
        const { data: { user: nextUser } } = nextProps
        if(!user && nextUser) {
            hashHistory.push('/dashboard')
        }
    }

    onSubmit({ email, password }) {
        this.props.mutate({
            variables: { email, password },
            // When this comes back, this query response updates every component that uses this query. In this case, the Header component automatically updates.
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
// Any time the current user is updated, this component will update.
export default graphql(query)(
    graphql(mutation)(LoginForm)
);