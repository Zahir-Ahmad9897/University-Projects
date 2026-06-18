const ConditionalContent = (props) => {
    return (
        <div className="card">
            <h2>Conditional Rendering</h2>
            {props.isLoggedIn ? (
                <p className="success">Welcome back, User! You are logged in.</p>
            ) : (
                <p className="error">Please log in to see the content.</p>
            )}
        </div>
    );
};

export default ConditionalContent;
