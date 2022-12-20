import TodoListItem from './TodoListItem';
import '../../css/todo/TodoList.scss';

const TodoList =({ todos, onRemove, onToggle }) => {
    return (
        <div className="TodoList">
            {todos.map(todo => (
                <TodoListItem todo={todo} key={todo.id} onRemove={onRemove} onToggle={onToggle}/>
            ))}
        </div>
    );
};

export default TodoList;
