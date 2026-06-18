const FruitList = (props) => {
    return (
        <div className="card">
            <h2>Fruit List (Task 6)</h2>
            <ul>
                {props.fruits.map((fruit, index) => (
                    <li key={index}>{fruit}</li>
                ))}
            </ul>
        </div>
    );
};

export default FruitList;
