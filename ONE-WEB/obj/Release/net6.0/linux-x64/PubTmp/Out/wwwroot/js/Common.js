function queryParameters() {
    var result = {};

    var params = window.location.search.split(/\?|\&/);

    params.forEach(function (it) {
        if (it) {
            var param = it.split("=");
            result[param[0]] = param[1];
        }
    });

    return result;
}

function GetPageList(id, pageCount, currentPage) {
    $('#' + id).html('');
    if (pageCount > 0) {
        if (pageCount >= 1) {
            var html = '';
            if (pageCount > 1) {
                html += "<li class='prev" + (currentPage == 1 ? ' disabled' : '') + "'><a href='#' onclick='javascript:ChangePage(1); return false;'><i class='fa fa-angle-double-left'></i></a></li><li style=''></li>";
                html += "<li class='prev" + (currentPage == 1 ? ' disabled' : '') + "'><a href='#' onclick='javascript:ChangePage(" + (currentPage - 1) + "); return false;'><i class='fa fa-angle-left'></i></a></li><li style=''></li>";
            }
            var showPages = 0, i;
            if (pageCount > 6) {
                if (pageCount == 4) {
                    if (currentPage > 4) {
                        html += "<li><a href='#' onclick='javascript:ChangePage(1); return false;'>1</a></li>";
                        html += "<li><span>...</span></li>";
                    }
                }
                else {
                    if (currentPage >= 4) {
                        html += "<li><a href='#'  onclick='javascript:ChangePage(1); return false;'>1</a></li>";
                        html += "<li><span>...</span></li>";
                    }
                }
                for (i = 1; i <= pageCount; i++) {
                    if (i > 0) {
                        showPages++;
                        if (currentPage >= 4) {
                            if (i != currentPage) {
                                if (i + 4 > pageCount && currentPage == i) {
                                    html += '<li><a href="#"  onclick="javascript:ChangePage(';
                                    html += i + '); return false;">' + i + "</a></li>";
                                }
                                else if (i >= currentPage - 2 && i <= currentPage + 1 && currentPage + 2 > pageCount) {
                                    html += '<li><a href="#"  onclick="javascript:ChangePage(';
                                    html += i + '); return false;">' + i + "</a></li>";
                                }
                                else if (pageCount == currentPage && i + 4 > pageCount) {
                                    html += '<li><a href="#"  onclick="javascript:ChangePage(';
                                    html += i + '); return false;">' + i + "</a></li>";
                                }
                                else if (i >= currentPage - 1 && i <= currentPage + 1) {
                                    html += '<li><a href="#"  onclick="javascript:ChangePage(';
                                    html += i + '); return false;">' + i + "</a></li>";
                                }

                            }
                            else if (i == currentPage) {
                                html += "<li class='active'><a>";
                                html += i + "</a></li>";
                            }
                        }
                        else {
                            if (i != currentPage) {
                                if (i <= currentPage + 3 && i <= 4) {
                                    html += '<li><a href="#"  onclick="javascript:ChangePage(';
                                    html += i + '); return false;">' + i + "</a></li>";
                                }
                            }
                            else if (i == currentPage) {
                                html += "<li class='active'><a>";
                                html += i + "</a></li>";
                            }
                        }
                    }
                }
                if (pageCount > 4 && (currentPage + 2) <= pageCount) {
                    html += "<li><span>...</span></li>";
                    html += "<li><a href='#'  onclick='javascript:ChangePage(";
                    html += pageCount + "); return false;'>" + pageCount + "</a></li>";
                }
            }
            else {
                for (i = 1; i <= pageCount; i++) {
                    if (i != currentPage) {
                        html += '<li><a href="#"  onclick="javascript:ChangePage(';
                        html += i + '); return false;">' + i + "</a></li>";
                    }
                    else if (i == currentPage) {
                        html += "<li class='active'><a>";
                        html += i + "</a></li>";
                    }
                }
            }
            if (pageCount > 1) {
                html += "<li class='next" + (currentPage == pageCount ? ' disabled' : '') + "'><a href='javascript:;'  onclick='javascript:ChangePage(";
                html += (currentPage + 1) + "); return false;'><i class='fa fa-angle-right'></i></a></li>";

                html += "<li class='next" + (currentPage == pageCount ? ' disabled' : '') + "'><a href='javascript:;'  onclick='javascript:ChangePage(";
                html += pageCount + "); return false;'><i class='fa fa-angle-double-right'></i></a></li>";
            }

        }
        html += '';
        $('#' + id).html(html);
    }
    else {
        $('#' + id).html('');
    }
}

function GetPageListWithFunction(id, pageCount, currentPage, func) {
    $('#' + id).html('');
    if (pageCount > 0) {
        if (pageCount >= 1) {
            var html = '';
            if (pageCount > 1) {
                html += "<li class='prev" + (currentPage == 1 ? ' disabled' : '') + "'><a href='#' onclick='javascript:" + func + "(1); return false;'><i class='fa fa-angle-double-left'></i></a></li><li style=''></li>";
                html += "<li class='prev" + (currentPage == 1 ? ' disabled' : '') + "'><a href='#' onclick='javascript:" + func + "(" + (currentPage - 1) + "); return false;'><i class='fa fa-angle-left'></i></a></li><li style=''></li>";
            }
            var showPages = 0, i;
            if (pageCount > 6) {
                if (pageCount == 4) {
                    if (currentPage > 4) {
                        html += "<li><a href='#' onclick='javascript:" + func + "(1); return false;'>1</a></li>";
                        html += "<li><span>...</span></li>";
                    }
                }
                else {
                    if (currentPage >= 4) {
                        html += "<li><a href='#'  onclick='javascript:" + func + "(1); return false;'>1</a></li>";
                        html += "<li><span>...</span></li>";
                    }
                }
                for (i = 1; i <= pageCount; i++) {
                    if (i > 0) {
                        showPages++;
                        if (currentPage >= 4) {
                            if (i != currentPage) {
                                if (i + 4 > pageCount && currentPage == i) {
                                    html += '<li><a href="#"  onclick="javascript:' + func + '(';
                                    html += i + '); return false;">' + i + "</a></li>";
                                }
                                else if (i >= currentPage - 2 && i <= currentPage + 1 && currentPage + 2 > pageCount) {
                                    html += '<li><a href="#"  onclick="javascript:' + func + '(';
                                    html += i + '); return false;">' + i + "</a></li>";
                                }
                                else if (pageCount == currentPage && i + 4 > pageCount) {
                                    html += '<li><a href="#"  onclick="javascript:' + func + '(';
                                    html += i + '); return false;">' + i + "</a></li>";
                                }
                                else if (i >= currentPage - 1 && i <= currentPage + 1) {
                                    html += '<li><a href="#"  onclick="javascript:' + func + '(';
                                    html += i + '); return false;">' + i + "</a></li>";
                                }

                            }
                            else if (i == currentPage) {
                                html += "<li class='active'><a>";
                                html += i + "</a></li>";
                            }
                        }
                        else {
                            if (i != currentPage) {
                                if (i <= currentPage + 3 && i <= 4) {
                                    html += '<li><a href="#"  onclick="javascript:' + func + '(';
                                    html += i + '); return false;">' + i + "</a></li>";
                                }
                            }
                            else if (i == currentPage) {
                                html += "<li class='active'><a>";
                                html += i + "</a></li>";
                            }
                        }
                    }
                }
                if (pageCount > 4 && (currentPage + 2) <= pageCount) {
                    html += "<li><span>...</span></li>";
                    html += "<li><a href='#'  onclick='javascript:" + func + "(";
                    html += pageCount + "); return false;'>" + pageCount + "</a></li>";
                }
            }
            else {
                for (i = 1; i <= pageCount; i++) {
                    if (i != currentPage) {
                        html += '<li><a href="#"  onclick="javascript:' + func + '(';
                        html += i + '); return false;">' + i + "</a></li>";
                    }
                    else if (i == currentPage) {
                        html += "<li class='active'><a>";
                        html += i + "</a></li>";
                    }
                }
            }
            if (pageCount > 1) {
                html += "<li class='next" + (currentPage == pageCount ? ' disabled' : '') + "'><a href='javascript:;'  onclick='javascript:" + func + "(";
                html += (currentPage + 1) + "); return false;'><i class='fa fa-angle-right'></i></a></li>";

                html += "<li class='next" + (currentPage == pageCount ? ' disabled' : '') + "'><a href='javascript:;'  onclick='javascript:" + func + "(";
                html += pageCount + "); return false;'><i class='fa fa-angle-double-right'></i></a></li>";
            }

        }
        html += '';
        $('#' + id).html(html);
    }
    else {
        $('#' + id).html('');
    }
}
