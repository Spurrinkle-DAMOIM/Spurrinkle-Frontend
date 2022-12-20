import "../../css/todo/TodoTemplate.scss";
import TodoInsert from "./TodoInsert";
import TodoList from "./TodoList";
import {useState, useRef, useCallback, useEffect} from 'react';
import axios from 'axios';
import uuid from 'react-uuid';
import dayjs from "dayjs";

const TodoTemplate = (props) => {
    const [state, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);
    //DB에 보낼 아이디, 날짜
    const userId = sessionStorage.getItem('id');
    const date = new Date();
    const day = dayjs(props.date).format("YYYY-MM-DD");
    console.log("또르륵,, : ",day);


    const [todos, setTodos] = useState([]);

    useEffect(() => {
        const list = [];
        const lists = {
            date: day,
            todo: {},
        }
        list.push(lists);
        axios.post('/todo/getList',
            {
                userId: userId,
                lists: list,
            })
            .then(async (res) => {
                console.log("가져온 데이터 : ", res.data);
                console.log("가져온 데이터2 : ", res.data.lists[0].todo);
                await res.data.lists[0].todo.map(async (list) => {
                    console.log("good?",list);
                    todos.push(list);
                    console.log(todos);
                })

                console.log("밖 : ");
                forceUpdate();
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    const onInsert = useCallback(
         text => {
            console.log("입력된 todo 값 : " , text);
            if(text.trim() !== '') {
                const list = [];
                const lists = {
                    date: day,
                    todo: {
                        id: uuid(),
                        content: text,
                        checked: false,
                    },
                }
                list.push(lists);
                axios.post('/todo/insert',{
                    userId : userId,
                    lists : list
                })
                    .then(async (res) => {
                        console.log("넣은 값 : ",res.data);
                        console.log("넣기전",todos.length);
                        todos.push(res.data);
                        console.log("넣은후",todos.length);
                })
                    .finally(async () => {
                        await console.log("마법",todos.length);
                        forceUpdate();
                    })
            }
        },
        [todos],
    )

    const onRemove = useCallback(
        async id => {
            console.log("아이디 확인 : ",id);
            // await setTodos(todos.filter(todo => todo.id !== id));
            let newtodos = todos.filter(todo => todo.id !== id);
            setTodos(newtodos);
            modify(newtodos);
        },
        [todos],
    );

    const modify = (todo) => {
        const list = [];
        const lists = {
            date: day,
            todo: todo,
        }
        list.push(lists);
        axios.post('/todo/remove', {
            userId : userId,
            lists : list
        })
            .then((res) => {
                console.log(res)
            })
    }

    const onToggle = useCallback(
        async id => {
            await todos.map(todo => {if(todo.id === id) {
                todo.checked = !todo.checked;
                modify(todos)}});
            forceUpdate();
        },
        [todos],
    );

    return (
        <>
        <div className="TodoTemplate" style={{borderRadius:"10px"}}>
            <div className="app-title" style={{fontSize:"19px"}}>일정 관리</div>
            <div className="content">
                <TodoInsert onInsert={onInsert}/>
                <TodoList height={"800px"} todos={todos} onRemove={onRemove} onToggle={onToggle}/>
            </div>
        </div>
        </>
    );
};

export default TodoTemplate;
