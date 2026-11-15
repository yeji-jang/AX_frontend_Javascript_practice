// HTML 문서를 다 읽은 뒤 안쪽 코드 실행함
document.addEventListener("DOMContentLoaded", function() {

    // HTML에서 필요한 요소 찾아 변수에 담기
    const todoForm = document.getElementById("todo-form");
    const todoInput = document.getElementById("todo-input");
    const todoDate = document.getElementById("date-input");
    const todoIn = document.getElementById("in-todo-list");
    const todoNotin = document.getElementById("notin-todo-list");

    // 브라우저에 저장된 todos 목록 가져오기
    const savedTodos = localStorage.getItem("todos");

    // 저장된 목록이 있으면 배열로 바꾸고, 없으면 빈 배열로 시작
    let todos = savedTodos ? JSON.parse(savedTodos) : [];

    // todos 배열의 내용을 화면에 표시하는 함수
    function renderTodos() {
        // 기존 목록을 비움
        todoIn.innerHTML = "";

        // 할 일이 없으면 안내 문구를 보여줌
        if (todos.length === 0) {
            todoNotin.hidden = false;
            todoIn.hidden = true;
            return;
        }

        // 할 일이 있으면 안내 문구를 숨기고 목록을 보여줌
        todoNotin.hidden = true;
        todoIn.hidden = false;

        // 할 일을 하나씩 꺼내 화면에 표시
        todos.forEach(function(todo) {
            const item = document.createElement("li");

            // 완료 체크박스 만들기
            const checkBox = document.createElement("input");
            checkBox.type = "checkbox";
            checkBox.checked = todo.completed;

            // 체크 상태가 바뀌면 완료 여부를 저장
            checkBox.addEventListener("change", function() {
                todo.completed = checkBox.checked;

                localStorage.setItem("todos", JSON.stringify(todos));
                renderTodos();
            });

            item.append(checkBox);

            // 마감기한 표시할 글자 준비
            let deadlineText = "마감기한 없음";

            if (todo.deadline !== "") {
                deadlineText = new Date(todo.deadline).toLocaleString();
            }

            // 우선순위 표시할 글자 준비
            let rankText = "우선순위 없음";

            if (todo.ranktype !== "") {
                rankText = todo.ranktype;
            }

            // 할 일 내용을 화면에 표시
            const todoText = document.createElement("span");

            todoText.textContent =
                todo.content + " — " + deadlineText + " — " + rankText;

            // 완료 체크를 했으면 취소선 표시
            if (todo.completed === true) {
                todoText.style.textDecoration = "line-through";
            }

            item.append(todoText);

            // 수정 버튼 만들기
            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.textContent = "수정";

            // 수정 버튼을 누르면 입력창으로 새 내용을 받음
            editButton.addEventListener("click", function() {
                const newContent = prompt(
                    "수정할 할 일을 입력하세요.",
                    todo.content
                );

                if (newContent === null || newContent.trim() === "") {
                    return;
                }

                const newDeadline = prompt(
                    "마감기한을 입력하세요. 예: 2026-10-05T18:30",
                    todo.deadline
                );

                if (newDeadline === null) {
                    return;
                }

                const newRank = prompt(
                    "우선순위를 입력하세요: 낮음, 보통, 중요, 매우중요",
                    todo.ranktype
                );

                if (newRank === null) {
                    return;
                }

                // 입력한 내용으로 할 일을 수정
                todo.content = newContent.trim();
                todo.deadline = newDeadline;
                todo.ranktype = newRank.trim();

                // 수정된 내용을 브라우저에 저장하고 화면을 다시 그림
                localStorage.setItem("todos", JSON.stringify(todos));
                renderTodos();
            });

            item.append(editButton);

            // 삭제 버튼 만들기
            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.textContent = "삭제";

            // 삭제 버튼을 누르면 선택한 할 일을 목록에서 제거
            deleteButton.addEventListener("click", function() {
                todos = todos.filter(function(savedTodo) {
                    return savedTodo.id !== todo.id;
                });

                // 삭제한 목록을 저장하고 화면을 다시 그림
                localStorage.setItem("todos", JSON.stringify(todos));
                renderTodos();
            });

            item.append(deleteButton);
            todoIn.append(item);
        });
    }

    // 폼이 제출되면 할 일을 추가
    todoForm.addEventListener("submit", function(event) {
        // 폼 제출로 페이지가 새로고침되는 것을 막음
        event.preventDefault();

        // 입력한 할 일의 앞뒤 공백을 제거
        const todoText = todoInput.value.trim();

        if (todoText === "") {
            alert("할 일을 입력해주세요.");
            return;
        }

        // 입력한 마감기한 가져오기
        const todoDeadline = todoDate.value;

        // 선택된 우선순위 가져오기
        const selectedRank =
            document.querySelector('input[name="rank"]:checked');

        let todoRank = "";

        if (selectedRank !== null) {
            todoRank = selectedRank.value;
        }

        // 할 일 하나를 객체로 만들기
        const newTodo = {
            id: Date.now(),
            content: todoText,
            deadline: todoDeadline,
            ranktype: todoRank,
            completed: false
        };

        // todos 배열에 새 할 일 추가
        todos.push(newTodo);

        // 바뀐 배열을 브라우저에 저장
        localStorage.setItem("todos", JSON.stringify(todos));

        // 목록을 다시 화면에 표시
        renderTodos();

        // 입력창을 비움
        todoForm.reset();
    });

    // 페이지를 열었을 때 저장된 목록을 화면에 표시
    renderTodos();
});