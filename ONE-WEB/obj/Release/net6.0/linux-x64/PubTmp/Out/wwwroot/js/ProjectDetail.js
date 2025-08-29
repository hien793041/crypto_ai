var PageTasks = 1;
var PageHistory = 1;

function ChangePageTasks(page) {
    angular.element(document.getElementById('kt_content')).scope().GetProjectTasksBy(page);
}

function ChangePageHistory(page) {
    angular.element(document.getElementById('kt_content')).scope().GetProjectHistory(page);
}

app.controller('myController', function ($scope, $filter, $http, $timeout, Notification) {
    $scope.submitted = false;
    $scope.ProjectManagerId = '';
    $scope.PageSizeTasks = 10;
    $scope.PageSizeHistory = 10;

    $scope.ShowAddTask = function () {

        //$('#Project_Task').select2("val", $scope.ActiveProject.Id).trigger('change');
    };

    $scope.AddTask = function () {

        if (!$scope.FormAddTask.$valid)
            return;

        var sHTML = $('#Note_AddTask').code();
        var input =
        {
            IsUpdate: false, ProjectId: $scope.ProjectId, Name: $scope.TaskName, Description: sHTML
            , StartDate: $('#StartDate_Task').val(), DueDate: $('#DueDate_Task').val()
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
                $scope.GetProjects();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $scope.submitted = false;
                Notification.error(msgError);
            }
        });
    };

    $scope.ShowEditProject = function () {
        $scope.Name_Edit = $scope.ActiveProject.Name;
        $scope.Website_Edit = $scope.ActiveProject.Website;
        $scope.StartDate_Edit = $filter('date')($scope.ActiveProject.StartDate, 'dd/MM/yyyy');
        $scope.DueDate_Edit = $filter('date')($scope.ActiveProject.DueDate, 'dd/MM/yyyy');
        $('#Note_EditProject').code($scope.ActiveProject.Description);
        $('#avatar_edit').attr('src', $scope.ActiveProject.Avatar);
        $scope.ProjectManagerId = $scope.ActiveProject.ProjectManagerId;
        $scope.ProjectManager_Edit = $scope.ActiveProject.ProjectManager;
    };

    $scope.GetProjectBy = function () {

        var input =
        {
            Id: $scope.ProjectId
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
                    $scope.GetProjectHistory(PageHistory);
                }
                else {
                    Notification.error(data.Message);
                }
                $scope.submitted = false;
                $scope.GetProjectBy();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $scope.submitted = false;
                Notification.error(msgError);
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
                $scope.StartDate_EditTask = $filter('date')(data.StartDate, 'dd/MM/yyyy');
                $scope.DueDate_EditTask = $filter('date')(data.DueDate, 'dd/MM/yyyy');
                if (!$scope.$$phase) { $scope.$apply(); }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    };

    $scope.SearchTasks = function () {

        $scope.GetProjectTasksBy(1);
    };

    $scope.GetProjectTasksBy = function (page) {
        PageTasks = page;

        $scope.ProjectTasks = [];
        var input =
        {
            ProjectId: $scope.ProjectId, Page: page, PageSize: $scope.PageSizeTasks
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
                if (data != null && data.length > 0) {
                    GetPageListWithFunction('pagerTasks', Math.ceil(data[0].TotalRow / $scope.PageSizeTasks), page, ChangePageTasks);
                    $scope.TotalRowTasks = data[0].TotalRow;
                    $scope.FromRowTasks = data[0].Row;
                    $scope.ToRowTasks = data[data.length - 1].Row;
                }
                else {
                    $scope.TotalRowTasks = 0;
                    $scope.FromRowTasks = 0;
                    $scope.ToRowTasks = 0;
                    $('#pagerTasks').html('');
                }
                if (!$scope.$$phase) { $scope.$apply(); }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    };

    $scope.EditTask = function () {

        if (!$scope.FormEditTask.$valid)
            return;

        var sHTML = $('#Note_EditTask').code();
        var input =
        {
            Id: $scope.TaskId, IsUpdate: true, ProjectId: $scope.ProjectId, Name: $scope.TaskName_Edit, Description: sHTML
            , StartDate: $('#StartDate_EditTask').val(), DueDate: $('#DueDate_EditTask').val()
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
                $scope.GetProjectTasksBy(PageTasks);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $scope.submitted = false;
                Notification.error(msgError);
            }
        });
    };

    $("#user_search,#assignuser_search,#projectmanager_edit_search").autocomplete({
        minLength: 1
    });

    $scope.Complete_UserName = function () {
        $scope.availableTags = [];
        var input =
        {
            Name: $scope.UserName
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

        $("#user_search").autocomplete({
            source: $scope.availableTags,
            select: function (event, ui) {
                var inputuserassignment =
                {
                    ProjectId: $scope.ActiveProject.Id, UserIdAssignment: ui.item.id
                };
                $.ajax({
                    type: 'POST',
                    url: '/Project/AddUserAssignmentToProject',
                    dataType: 'json',
                    data: { data: JSON.stringify(inputuserassignment) },
                    success: function (data) {
                        if (data.Result > 0) {
                            $scope.GetProjectUserAssignment($scope.ProjectId);
                            Notification.success(data.Message);
                        }
                        else {
                            Notification.error(data.Message);
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        Notification.error(msgError);
                    }
                });
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

    $scope.GetProjectUserAssignment = function (projectId) {
        $scope.ProjectUserAssignment = [];
        var input =
        {
            ProjectId: projectId
        };

        $.ajax({
            type: 'POST',
            async: true,
            url: '/Project/GetProjectUserAssignment',
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                $scope.ProjectUserAssignment = data;
                if (!$scope.$$phase) { $scope.$apply(); }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    };


    $scope.ShowAssignUser = function (taskid) {
        $scope.TaskId = taskid;
    };

    $scope.Complete_AssignUserName = function () {
        $scope.availableTags = [];
        var input =
        {
            Name: $scope.AssignUserName
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

        $("#assignuser_search").autocomplete({
            source: $scope.availableTags,
            select: function (event, ui) {
                var inputuserassignment =
                {
                    ProjectId: $scope.ActiveProject.Id, UserIdAssignment: ui.item.id, TaskId: $scope.TaskId
                };
                $.ajax({
                    type: 'POST',
                    url: '/Project/AddUserAssignmentToProject',
                    dataType: 'json',
                    data: { data: JSON.stringify(inputuserassignment) },
                    success: function (data) {
                        if (data.Result > 0) {
                            $scope.GetProjectTasksBy(PageTasks);
                            $scope.GetProjectUserAssignment($scope.ProjectId);
                            Notification.success(data.Message);
                        }
                        else {
                            Notification.error(data.Message);
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        Notification.error(msgError);
                    }
                });
            }
        });

    }

    $scope.ReadMoreDescription = function (id) {
        if ($("#ReadMoreDes-" + id).hasClass('hide-desc')) {
            $("#ReadMoreDes-" + id).removeClass("hide-desc").addClass("more-desc");
            document.getElementById("btReadMoreDes-" + id).innerHTML = msgHide;
        }
        else {
            $("#ReadMoreDes-" + id).removeClass("more-desc").addClass("hide-desc");
            document.getElementById("btReadMoreDes-" + id).innerHTML = msgReadMore;
        }
    };

    $scope.SearchHistory = function () {

        $scope.GetProjectHistory(1);
    };

    $scope.GetProjectHistory = function (page) {
        PageHistory = page;

        $scope.ProjectHistory = [];
        var input =
        {
            ProjectId: $scope.ProjectId, Page: page, PageSize: $scope.PageSizeHistory
        };

        $.ajax({
            type: 'POST',
            async: true,
            url: '/Project/GetProjectHistory',
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                $scope.ProjectHistory = data;
                if (data != null && data.length > 0) {
                    GetPageListWithFunction('pagerHistory', Math.ceil(data[0].TotalRow / $scope.PageSizeHistory), page, 'ChangePageHistory');
                    $scope.TotalRowHistory = data[0].TotalRow;
                    $scope.FromRowHistory = data[0].Row;
                    $scope.ToRowHistory = data[data.length - 1].Row;
                }
                else {
                    $scope.TotalRowHistory = 0;
                    $scope.FromRowHistory = 0;
                    $scope.ToRowHistory = 0;
                    $('#pagerHistory').html('');
                }
                if (!$scope.$$phase) { $scope.$apply(); }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    };

    $scope.ProjectId = queryParameters().id;
    $scope.GetProjectBy();
    $scope.GetProjectTasksBy(PageTasks);
    $scope.GetProjectUserAssignment($scope.ProjectId);
    $scope.GetProjectHistory(PageHistory);
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