// HTML 문서를 다 읽은 뒤 안쪽 코드 실행함
document.addEventListener("DOMContentLoaded", function () {

    // HTML에서 필요한 요소 찾아 미리 변수에 담음
    const todoForm = document.getElementById("todo-form") ;
    const todoInput = document.getElementById("todo-input") ;
    const todoList = document.getElementById("todo-list") ;
    const emptyMessage = document.getElementById("empty-message") ;

    // 브라우저 저장소에서 할 일 목록 가져오기
    // 저장된 목록 없으면 빈 배열로 사용
    let todos = JSON.parse(localStorage.getItem("todos")) || [] ;


    // 할 일 목록을 화면에 표시하는 함수
    function showTodos() {
        // 화면에 있던 목록 비움
        todoList.innerHTML = "";

        // 목록에 있는 할 일을 하나씩 화면에 추가
        todos.forEach(function (todo) {
            // 새로운 목록 항목 만들기
            const listItem = document.createElement("li") ;

            // 목록 항목에 할 일 내용 넣음
            listItem.textContent = todo;
            // 만든 항목을 할 일 목록에 추가
            todoList.appendChild(listItem) ;
        }) ;


        // 목록에 할 일이 없으면 안내 문구 보여줌
        if (todos.length === 0) {
            emptyMessage.style.display = "block";
        } 
        else {
            // 할 일이 있으면 안내 문구 숨김
            emptyMessage.style.display = "none";
        } ;
    };

    // form을 제출할 때 실행할 코드 -> 추가 버튼을 누르면 입력된 폼이 제출됨
    todoForm.addEventListener("submit", function (event) {
        
        // 폼 제출로 페이지가 새로고침되는 것 막음
        event.preventDefault();

        // 입력창의 글자를 가져오고 앞뒤 공백 제거
        const todoText = todoInput.value.trim();

        // 입력한 내용이 없으면 실행 멈춤
        if (todoText === "") {
            return ;
        } 

        // 새 할일을 목록에 추가
        todos.push(todoText) ;

        // 할 일 목록을 브라우저 저장소localStorage에 저장
        localStorage.setItem("todos", JSON.stringify(todos));

        // 바뀐 목록을 화면에 다시 표시
        showTodos();
        // 입력창 비움
        todoInput.value = "" ;
    });


    // 페이지를 열었을 때 저장된 목록 표시
    showTodos();
});