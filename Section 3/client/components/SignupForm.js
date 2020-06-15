import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { hashHistory } from 'react-router';
import AuthForm from './AuthForm';
import mutation from '../mutations/Signup';
import query from '../queries/CurrentUser'

class SignupForm extends Component {
    constructor(props) {
        super(props);
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

    // Can't use a .then redirect to dashboard here due to race condition. It would likely take place before the refetch completes.
    onSubmit({ email, password }) {
        this.props.mutate({
            variables: { email, password },
            refetchQueries: [{ query }],
        }).catch(res => {
            const errors = res.graphQLErrors.map(error => error.message);
            this.setState({ errors });
        })
    }

    render() {
        return (
            <div>
                <h3>Signup</h3>
                <AuthForm
                    errors={this.state.errors}
                    onSubmit={this.onSubmit.bind(this)}
                />
            </div>
        );
    }
}

export default graphql(query)(
    graphql(mutation)(SignupForm)
);