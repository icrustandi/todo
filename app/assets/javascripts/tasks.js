  $(function() { // wait until current page loads -> page load in event queue
      

      function taskHtml(task){ //method that builds HTML representation of the li tag
        var checkedStatus = task.done ? "checked" : "";
        var liClass = task.done ? "completed" : "";
        var liElement = '<li id="listItem-' + task.id +'" class="' + liClass + '">' +
        '<div class="view"><input class="toggle" type="checkbox"' +
        " data-id='" + task.id + "'" +
        checkedStatus +
        '><label>' +
         task.title +
         '</label></div></li>';
        return liElement;
      }

      function toggleTask(e){ // method that takes in HTML representation of an event that fires from an HTML representation of the toggle checkbox and performs an API request to toggle the value of the done field POST/PUT
        var itemId = $(e.target).data("id");

        var doneValue = Boolean($(e.target).is(':checked'));

        $.post("/tasks/" + itemId, {
          _method: "PUT",
          task: {
            done: doneValue
          }
        }).success(function(data) {
        var liHtml = taskHtml(data);
        var $li = $("#listItem-" + data.id);
        $li.replaceWith(liHtml);
        $('.toggle').change(toggleTask);
        } );

      }

    $.get("/tasks").success( function( data ) { //wait for http response -> http response in event queue
      var htmlString = "";
      $.each(data, function(index,  task) { //loop through todo data array, executed inline, not in event queue. 
        htmlString += taskHtml(task);
      });

      var ulTodos = $('.todo-list'); //finds todo-list ul block and stores it into vraible
      ulTodos.html(htmlString); //inserts htmlString into ul todo-list

      $('.toggle').change(toggleTask);

    });

    $('#new-form').submit(function(event) {
      event.preventDefault();
      var textbox = $('.new-todo');
      var payload = {
        task: {
          title: textbox.val()
        }
      };
      $.post("/tasks", payload).success(function(data) {
        var htmlString = taskHtml(data);
        var ulTodos = $('.todo-list');
        ulTodos.append(htmlString);
        $('.toggle').click(toggleTask);
        $('.new-todo').val('');
      });
    });

  });