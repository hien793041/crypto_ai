var Page = 1;

function ChangePage(page) {
    Page = page;
    angular.element(document.getElementById('kt_content')).scope().GetProjects(Page);
}

app.controller('myController', function ($scope, $filter, $http, $timeout, Notification) {
    $scope.submitted = false;
    $scope.ProjectManagerId = '';
    $scope.TotalRow = 0;
    $scope.PageSize = 10;

    $scope.ShowAddProject = function () {
        $scope.Name = '';
        $scope.Website = '';
        $('#StartDate').val('');
        $('#DueDate').val('');
        $('#Note_AddProject').code('');
        $('#avatar').attr('src', '');
        $scope.ProjectManagerId = '';
        $scope.ProjectManager = '';
        $('#project_btRemoveAvatar').click();
    };
    $scope.AddProject = function () {
        if (!$scope.FormAddProject.$valid)
            return;

        var input_data = new FormData();

        var files = $('#fileAvatar').get(0).files;
        var fileSize = 0;
        if (files.length > 0) {
            if (window.FormData !== undefined) {
                
                input_data.append("file", files[0]);
                fileSize += files[0].size;
            }
        }

        var sHTML = $('#Note_AddProject').code(); 
        var input =
        {
            IsUpdate: false, Name: $scope.Name, Description: sHTML
            , StartDate: $('#StartDate').val(), DueDate: $('#DueDate').val()
            , Website: $scope.Website, ProjectManagerId: $scope.ProjectManagerId
        };

        input_data.append("data", JSON.stringify(input));

        $.ajax({
            type: 'POST',
            url: '/Project/UpdateProject',
            contentType: false,
            processData: false,
            async: true,
            data: input_data,
            dataType: 'json',
            success: function (data) {
                if (data.Result > 0) {
                    $('#Popup_AddProject').modal('toggle');
                    Notification.success(data.Message);
                }
                else {
                    Notification.error(data.Message);
                }
                $scope.submitted = false;
                $scope.GetProjects(1);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $scope.submitted = false;
                Notification.error(msgError);
            }
        });
    };

    $scope.Search = function () {

        $scope.GetProjects(1);
    };

    $scope.GetProjects = function (page) {
        Page = page;

        if ($scope.Search_Status == undefined || $scope.Search_Status == null)
            $scope.Search_Status = -1;

        var input =
        {
            Page: page, PageSize: $scope.PageSize, Status: $scope.Search_Status, Name: $scope.Search_Name
        };

        var post = $http({
            method: "POST",
            url: '/Project/GetProjects',
            dataType: 'json',
            params: { data: JSON.stringify(input) },
            headers: { "Content-Type": "application/json" }
        });

        post.success(function (data, status) {
            $scope.Projects = data;
            if (data != undefined && data.length > 0) {
                GetPageList('pager', Math.ceil(data[0].TotalRow / $scope.PageSize), page);
                $scope.TotalRow = $scope.Projects[0].TotalRow;
                $scope.FromRow = $scope.Projects[0].Row;
                $scope.ToRow = $scope.Projects[$scope.Projects.length - 1].Row;
            }
            else {
                $scope.TotalRow = 0;
                $scope.FromRow = 0;
                $scope.ToRow = 0;
                $('#pager').html('');
            }

            setTimeout(function () {
                //var fauxTable = document.getElementById('faux-table');
                //var mainTable = document.getElementById('main-table');
                //var clonedElement = mainTable.cloneNode(true);
                //var clonedElement2 = mainTable.cloneNode(true);
                //clonedElement.id = '';
                //clonedElement2.id = '';
                //fauxTable.appendChild(clonedElement);
                //fauxTable.appendChild(clonedElement2);

            }, 2000);

            
        });

        post.error(function (data, status) {
            $scope.Projects = [];
            $scope.TotalRow = 0;
            $scope.FromRow = 0;
            $scope.ToRow = 0;
            $('#pager').html('');
        });

        return;
        $http(
            {
                method: 'POST',
                url: '/Project/GetProjects',
                dataType: 'json',
                data: {
                    data: JSON.stringify(input)
                },
            }).then(function (response) {
                $scope.Projects = response.data;
                GetPageList('pager', Math.ceil(response.data[0].TotalRow / $scope.PageSize), page);
                $scope.TotalRow = $scope.Projects[0].TotalRow;
                $scope.FromRow = $scope.Projects[0].Row;
                $scope.ToRow = $scope.Projects[$scope.Projects.length - 1].Row;

                //if ($scope.Projects.length > 0) {
                //    if ($scope.ActiveProject == null)
                //        $scope.ActiveProject = $scope.Projects[0];
                //    else
                //        $scope.ActiveProject = response.data.find(x => x.Id === $scope.ActiveProject.Id);
                        
                //    $scope.GetProjectTasksBy($scope.ActiveProject.Id);
                //    $("#Project_Task").select2('data', { id: $scope.ActiveProject.Id, text: $scope.ActiveProject.Name });
                //}
            }, function (error) {
                $scope.Projects = [];
            });
    };

    $scope.ViewProjectDetail = function (id) {
        $("#detail-" + id).toggle();

        if ($("#detail-" + id).is(':visible')) {
            document.getElementById("btdetail-" + id).innerHTML = msgHide;
        }
        else
            document.getElementById("btdetail-" + id).innerHTML = msgView;
    };

    $scope.ShowAddTask = function () {

        $('#Project_Task').select2("val", $scope.ActiveProject.Id).trigger('change');
    };

    $scope.ChooseProject = function (x) {
        $scope.ActiveProject = x;
        $scope.GetProjectTasksBy($scope.ActiveProject.Id);
    };

    $scope.AddTask = function () {

        if (!$scope.FormAddTask.$valid)
            return;

        var sHTML = $('#Note_AddTask').code();
        var input =
        {
            IsUpdate: false, ProjectId: $("#Project_Task").val(), Name: $scope.TaskName, Description: sHTML
        };

        $.ajax({
            type: 'POST',
            url: '/Project/UpdateProjectTask',
            async: true,
            data: { data: JSON.stringify(input) },
            dataType: 'json',
            success: function (data) {
                if (data.Result > 0) {
                    $('#Popup_AddTask').modal('toggle');
                    Notification.success(data.Message);
                }
                else {
                    Notification.error(data.Message);
                }
                $scope.submitted = false;
                $scope.GetProjects(Page);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $scope.submitted = false;
                Notification.error(msgError);
            }
        });
    };

    $("#projectmanager_search, #projectmanager_edit_search").autocomplete({
        minLength: 1
    });

    $scope.Complete_ProjectManager = function () {
        $scope.availableTags = [];
        var input =
        {
            Name: $scope.ProjectManager_Edit
        };
        $.ajax({
            type: 'POST',
            url: '/User/SearchUsers',
            async: false,
            dataType: 'json',
            data: { data: JSON.stringify(input) },
            success: function (data) {
                for (var i = 0; i < data.length; i++) {
                    var obj = {
                        value: data[i].FullName,
                        id: data[i].Id
                    };
                    $scope.availableTags.push(obj);
                }
            },

            error: function (XMLHttpRequest, textStatus, errorThrown) {

            }
        });

        $("#projectmanager_search").autocomplete({
            source: $scope.availableTags,
            select: function (event, ui) {
                $scope.ProjectManagerId = ui.item.id;
            }
        });

    }

    $scope.Complete_ProjectManager_Edit = function () {
        $scope.availableTags = [];
        var input =
        {
            Name: $scope.ProjectManager_Edit
        };
        $.ajax({
            type: 'POST',
            url: '/User/SearchUsers',
            async: false,
            dataType: 'json',
            data: { data: JSON.stringify(input) },
            success: function (data) {
                for (var i = 0; i < data.length; i++) {
                    var obj = {
                        value: data[i].FullName,
                        id: data[i].Id
                    };
                    $scope.availableTags.push(obj);
                }
            },

            error: function (XMLHttpRequest, textStatus, errorThrown) {

            }
        });

        $("#projectmanager_edit_search").autocomplete({
            source: $scope.availableTags,
            select: function (event, ui) {
                $scope.ProjectManagerId = ui.item.id;
            }
        });

    }

    $scope.ShowEditProject = function (id) {
        var input =
        {
            Id: id
        };

        $.ajax({
            type: 'POST',
            async: true,
            url: '/Project/GetProjectBy',
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                $scope.ActiveProject = data;
                $scope.Name_Edit = data.Name;
                $scope.Website_Edit = data.Website;
                $scope.StartDate_Edit = $filter('date')(data.StartDate, 'dd/MM/yyyy');
                $scope.DueDate_Edit = $filter('date')(data.DueDate, 'dd/MM/yyyy');
                $('#Note_EditProject').code(data.Description);
                $('#avatar_edit').attr('src', data.Avatar);
                $scope.ProjectManagerId = data.ProjectManagerId;
                $scope.ProjectManager_Edit = data.ProjectManager;
                if (!$scope.$$phase) { $scope.$apply(); }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });

        
    };

    $scope.GetProjectBy = function (id) {
        var input =
        {
            Id: id
        };

        $.ajax({
            type: 'POST',
            async: true,
            url: '/Project/GetProjectBy',
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                $scope.ActiveProject = data;
                //$scope.Name_Edit = data.Name;
                //$('#Note_EditTopic').code(data.Description);
                //$('#avatar_edit').attr('src', data.Avatar);
                if (!$scope.$$phase) { $scope.$apply(); }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    };

    $scope.GetTaskBy = function (id) {
        $scope.TaskId = id;
        var input =
        {
            Id: id
        };

        $.ajax({
            type: 'POST',
            async: true,
            url: '/Project/GetTaskBy',
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                $scope.TaskName_Edit = data.Name;
                $('#Note_EditTask').code(data.Description);
                $('#Project_Task_Edit').select2("val", data.ProjectId).trigger('change');
                if (!$scope.$$phase) { $scope.$apply(); }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    };

    $scope.GetProjectTasksBy = function (projectId) {
        $scope.ProjectTasks = [];
        var input =
        {
            ProjectId: projectId
        };

        $.ajax({
            type: 'POST',
            async: true,
            url: '/Project/GetProjectTasksBy',
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                $scope.ProjectTasks = data;
                if (!$scope.$$phase) { $scope.$apply(); }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    };

    $scope.EditProject = function () {
        if (!$scope.FormEditProject.$valid)
            return;

        var input_data = new FormData();

        var files = $('#fileAvatar_Edit').get(0).files;
        var fileSize = 0;
        if (files.length > 0) {
            if (window.FormData !== undefined) {

                input_data.append("file", files[0]);
                fileSize += files[0].size;
            }
        }

        var sHTML = $('#Note_EditProject').code();
        var input =
        {
            Id: $scope.ActiveProject.Id, IsUpdate: true, Name: $scope.Name_Edit, Description: sHTML
            , StartDate: $('#StartDate_Edit').val(), DueDate: $('#DueDate_Edit').val()
            , Website: $scope.Website_Edit, ProjectManagerId: $scope.ProjectManagerId
        };

        input_data.append("data", JSON.stringify(input));

        $.ajax({
            type: 'POST',
            url: '/Project/UpdateProject',
            contentType: false,
            processData: false,
            async: true,
            dataType: 'json',
            data: input_data,
            success: function (data) {
                if (data.Result > 0) {
                    $('#Popup_EditProject').modal('toggle');
                    Notification.success(data.Message);
                }
                else {
                    Notification.error(data.Message);
                }
                $scope.submitted = false;
                $scope.GetProjects(Page);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $scope.submitted = false;
                Notification.error(msgError);
            }
        });
    };

    $scope.EditTask = function () {

        if (!$scope.FormEditTask.$valid)
            return;

        var sHTML = $('#Note_EditTask').code();
        var input =
        {
            Id: $scope.TaskId, IsUpdate: true, ProjectId: $("#Project_Task_Edit").val(), Name: $scope.TaskName_Edit, Description: sHTML
        };

        $.ajax({
            type: 'POST',
            url: '/Project/UpdateProjectTask',
            async: true,
            data: { data: JSON.stringify(input) },
            dataType: 'json',
            success: function (data) {
                if (data.Result > 0) {
                    $('#Popup_EditTask').modal('toggle');
                    Notification.success(data.Message);
                }
                else {
                    Notification.error(data.Message);
                }
                $scope.submitted = false;
                $scope.GetProjectTasksBy($scope.ActiveProject.Id);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $scope.submitted = false;
                Notification.error(msgError);
            }
        });
    };

    $scope.GetListStatus = function (type) {
        var input =
        {
            Type: type
        };

        $.ajax({
            type: 'POST',
            url: '/Home/GetStatus',
            async: false,
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                $scope.ListStatus = data;
                if (!$scope.$$phase) { $scope.$apply(); }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $scope.ListStatus = [];
            }
        });

    };
    $scope.GetListStatus(2);
    $scope.GetProjects(Page);
});

app.filter('startFrom', function () {
    return function (input, start) {
        if (input) {
            start = +start; //parse to int
            return input.slice(start);
        }
        return [];
    }
});