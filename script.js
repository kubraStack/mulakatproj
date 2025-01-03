//DOM Elemanlarını Seçme
const taskForm = document.getElementById('task-form'); //Form elementi
const taskInput = document.getElementById('task-input'); // Görev Giriş Alanı
const prioritySelect = document.getElementById('priority-select'); // Öncelik Seçimi
const taskList = document.getElementById('task-list'); //Görev Listesi

//Sayfa Yüklendiğinde görevleri localStorage'dan yükleme

document.addEventListener('DOMContentLoaded', loadTasks);

function loadTasks(){
    const task = JSON.parse(localStorage.getItem('tasks')) || []; //localStorage'dan görevleri al
    task.forEach((task) => {
        addTaskToDOM(task.text, task.priority, task.completed); //Her görevi DOM'a ekler
    })
}

//Görev Ekleme 
taskForm.addEventListener('submit', (e) => {
    e.preventDefault(); //Sayfanın yeniden yüklenmesini engeller
    const taskText = taskInput.value; 
    const taskPriority = prioritySelect.value; 

    if (taskText !== '') {
        addTaskToDOM(taskText, taskPriority); //Görevi DOM'a ekler
        saveTaskLocalStorage(taskText, taskPriority); //Görevi localStorage'a ekler
        taskInput.value = ''; 
        prioritySelect.value = 'low'; 
    }
});



//Görevi DOM'a ekler
function addTaskToDOM(taskText, taskPriority, completed =false){
    const li = document.createElement('li'); //Liste elemanı oluşturur
    li.className = `task-item ${taskPriority} ${completed ? 'completed': ''}`; //Öncelik ve tamamlama durumuna göre sınıf ataması
    //Girilen her görevin HTML yapısını oluşturur
    li.innerHTML = `

        <span class="task-text">${taskText}</span>
        <div>
            <button class="btn completed">Tamamlandı</button> 
            <button class="btn edit">Düzenle</button> 
            <button class="btn delete">Sil</button> 
        </div>
    
    `; 
    taskList.appendChild(li);
}

//Görevi localStorage 'a kaydeder
function saveTaskLocalStorage(taskText, taskPriority, completed = false){
    const tasks = JSON.parse(localStorage.getItem('tasks')) || []; //localStorage'dan görevleri alır
    tasks.push({text: taskText, priority: taskPriority, completed}); //Görevi diziye ekler
    localStorage.setItem('tasks', JSON.stringify(tasks)); //Güncellenmiş görev listesini localStorage'a kaydeder
}

//LocalStorage'ı güncelleme (Silme, Düzenleme sonrası)
function updateLocalStorage(){
    const tasks = [];
    document.querySelectorAll('task-item').forEach((item) => {
        const text = item.querySelector('span').textContent; 
        const priority = item.className.split(' ')[1];
        const completed = item.classList.contains('completed'); 

        tasks.push({text, priority, completed}); 
    });
    localStorage.setItem('tasks', JSON.stringify(tasks)); 
}

//Görev Listesi işlemleri (Tamamlama, Düzenleme, Silme)
taskList.addEventListener('click', (e) => {
    const taskItem = e.target.closest('.task-item'); //Tıklanan elemanın en yakın task-item elemanını alır

    if (e.target.classList.contains('completed')) { 
        taskItem.classList.toggle('completed'); 
        updateLocalStorage(); 
    }else if(e.target.classList.contains('edit')){
        const taskText = taskItem.querySelector('span').textContent; 
        taskInput.value = taskText; 
        prioritySelect.value = taskItem.className.split(' ')[1]; 
        taskItem.remove();
        updateLocalStorage(); 
    }else if(e.target.classList.contains('delete')){
        taskItem.remove(); 
        updateLocalStorage(); 
    }
})