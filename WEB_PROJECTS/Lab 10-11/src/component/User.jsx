const User = (props) => {
    return(
        <div className="card">
            <h2>User Component</h2>
            <p>Name from Props: <strong>{props.name}</strong></p>
        </div>
    );
}
export default User