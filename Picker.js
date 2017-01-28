
var Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var Weekdays = ["S", "M", "T", "W", "T", "F", "S"];
var objPicker;

function Picker()
{
    var objMainContainer = document.body;
    this.objResultInput = new Object();
    var objDate = new Date();
    var nCurYear = objDate.getFullYear();
    var nCurMonthIndex = objDate.getMonth();
    var nCurDate = objDate.getDate();
    var objResultDate = new Date();
    var arrDates = new Array(42);
    var objDivDays = new Object();
    var objDivMonths = new Object();
    var objDivYears = new Object();
    var objMonthTitle = new Object();
    var objYearTitle = new Object();
    var bDragging = false;
    var bDragged = false;
    var nPanelsTimer = null;
    var nClientX = 0;
    var nClientY = 0;
    this.Show = Show;
    this.GetDate = GetDate;
    this.OnSelectMonth = OnSelectMonth;
    Render();
    
    function Render()
    {
        objDivDays = objMainContainer.appendChild(document.createElement("div"));
        objDivDays.id = "divPickerDays";
        objDivDays.style.display = "none";
        objDivDays.style.position = "absolute";
        objDivDays.onmousedown = OnDragStart;
        objDivDays.onclick = CancelBuble;
    
        var oTable = objDivDays.appendChild(document.createElement("table"));
        oTable.className = "pickerBody";
        oTable.cellPadding = 0;
        oTable.cellSpacing = 0;
        RenderHeader(oTable);
        RenderWeekdays(oTable);
    
        var oCell = oTable.insertRow().insertCell();
        oCell.id = "tdPickerDays";
        oCell.colSpan = 7;
        RenderDays(oCell);
    
        objDivMonths = objMainContainer.appendChild(document.createElement("div"));
        objDivMonths.id = "divPickerMonths";
        objDivMonths.style.display = "none";
        objDivMonths.style.position = "absolute";
        RenderMonths(objDivMonths);
    
        objDivYears = objMainContainer.appendChild(document.createElement("div"));
        objDivYears.id = "divPickerYears";
        objDivYears.style.display = "none";
        objDivYears.style.position = "absolute";
        RenderYears(objDivYears);
    }
    
    function RenderHeader(argTable)
    {
        var oRow = argTable.insertRow();
        oRow.className = "pickerHeader";
        var oCell = oRow.insertCell();
        oCell.align = "left";
        var oImg = oCell.appendChild(document.createElement("img"));
        oImg.src = "Picker/prev.gif";
        oImg.style.cursor = "hand";
        oImg.onclick = OnPrevMonth;
        
        oCell = oRow.insertCell();
        oCell.colSpan = 5;
        oCell.align = "center";
        objMonthTitle = oCell.appendChild(document.createElement("span"));
        objMonthTitle.className = "pickerHeaderMonthYear";
        objMonthTitle.onmouseover = OnShowMonths;
        objMonthTitle.innerText = Months[nCurMonthIndex];
        objMonthTitle.insertAdjacentHTML("afterEnd", "&nbsp;");
        objYearTitle = oCell.appendChild(document.createElement("span"));
        objYearTitle.className = "pickerHeaderMonthYear";
        objYearTitle.onmouseover = OnShowYears;
        objYearTitle.innerText = nCurYear;
        
        oCell = oRow.insertCell();
        oCell.align = "right";
        oImg = oCell.appendChild(document.createElement("img"));
        oImg.src = "Picker/next.gif";
        oImg.style.cursor = "hand";
        oImg.onclick = OnNextMonth;
    }

    function RenderWeekdays(argTable)
    {
        var oRow = argTable.insertRow();
        oRow.className = "pickerWeekday";
        var i;
        for (i=0; i<7 ; i++)
            oRow.insertCell().innerText = Weekdays[i];
    }

    function RenderDays(argContainer)
    {
        var oTable = argContainer.appendChild(document.createElement("table"));
        oTable.className = "pickerDaysTable";
        oTable.cellPadding = 0;
        oTable.cellSpacing = 0;
            
        objDate = new Date(nCurYear, nCurMonthIndex, 1);
        var prevMonthDays = objDate.getDay();
        if (!prevMonthDays)
            prevMonthDays = 7;
        
        objDate.setDate(0);
        var prevMonthLastDate = objDate.getDate() - prevMonthDays;
        var oCell;
        var i;
        var oRow = oTable.insertRow();
        var nTableIndex = 0;
        for (i = 0; i<prevMonthDays; i++)
        {
            oCell = oRow.insertCell();
            oCell.className = "pickerOutMonthDay";
            oCell.innerText = prevMonthLastDate + i;
            oCell.onmouseover = OnOverCell;
            oCell.onmouseout = OnOutCell;
            oCell.onclick = OnSelectDate;
            arrDates[nTableIndex] = new Date(objDate.getFullYear(), objDate.getMonth(), prevMonthLastDate + i);
            oCell.id = nTableIndex;
            nTableIndex++;
        }
        objDate.setDate(1);
        objDate.setFullYear(nCurYear);
        objDate.setMonth(nCurMonthIndex + 1);
        objDate.setDate(0);
        var curMonthDays = objDate.getDate();
        var oRow;
        for (i=1; i<=curMonthDays; i++)
        {
            if (!(nTableIndex%7))
                oRow = oTable.insertRow();
            oCell = oRow.insertCell();
            if (i == nCurDate)
                oCell.className = "pickerCurrentDay";
            else
                oCell.className = "pickerInMonthDay";
            oCell.innerText = i;
            oCell.onmouseover = OnOverCell;
            oCell.onmouseout = OnOutCell;
            oCell.onclick = OnSelectDate;
            arrDates[nTableIndex] = new Date(nCurYear, nCurMonthIndex, i);
            oCell.id = nTableIndex;
            nTableIndex++;
        }
        
        objDate.setDate(1);
        objDate.setMonth(nCurMonthIndex + 1);
        for (i = 1; i<(43 - (prevMonthDays + curMonthDays)); i++)
        {
            if (!(nTableIndex%7))
                oRow = oTable.insertRow();
            oCell = oRow.insertCell();
            oCell.className = "pickerOutMonthDay";
            oCell.innerText = i;
            oCell.onmouseover = OnOverCell;
            oCell.onmouseout = OnOutCell;
            oCell.onclick = OnSelectDate;
            arrDates[nTableIndex] = new Date(objDate.getFullYear(), objDate.getMonth(), i);
            oCell.id = nTableIndex;
            nTableIndex++;
        }
    }

    function RenderMonths(argContainer)
    {
        var oTable = argContainer.appendChild(document.createElement("table"));
        oTable.cellPadding = 0;
        oTable.cellSpacing = 0;
        oTable.border = 0;
        var i,j;
        var oRow;
        var oCell;
        for (i=0; i<2; i++)
        {
            oRow = oTable.insertRow();
            for (j=0; j<6; j++)
            {
                oCell = oRow.insertCell();
                oCell.className = "pickerMonth";
                oCell.innerText = Months[i*6+j];
                oCell.onmouseover = OnOverCell;
                oCell.onmouseout = OnOutCell;
                oCell.onclick = new Function("objPicker.OnSelectMonth("+ (i*6+j) +")");
            }
        }
    }

    function RenderYears(argContainer)
    {
        var oTable = argContainer.appendChild(document.createElement("table"));
        oTable.cellPadding = 0;
        oTable.cellSpacing = 0;
        oTable.border = 0;
        var i;
        var oCell = oTable.insertRow().insertCell();
        oCell.className = "pickerMonth";
        oCell.onmouseover = OnOverCell;
        oCell.onmouseout = OnOutCell;
        oCell.onclick = OnUpYear;
        var oImg = oCell.appendChild(document.createElement("img"));
        oImg.src = "Picker/up.gif";
        oImg.onmouseover = ClearTimer;
        oImg.onmouseout = SetTimer;
        for (i=0; i<10; i++)
        {
            oCell = oTable.insertRow().insertCell();
            oCell.className = "pickerMonth";
            oCell.id = "tdPickerYear";
            oCell.onmouseover = OnOverCell;
            oCell.onmouseout = OnOutCell;
            oCell.onclick = OnSelectYear;
        }
        SetYears(nCurYear);
        oCell = oTable.insertRow().insertCell();
        oCell.className = "pickerMonth";
        oCell.onmouseover = OnOverCell;
        oCell.onmouseout = OnOutCell;
        oCell.onclick = OnDownYear;
        oImg = oCell.appendChild(document.createElement("img"));
        oImg.src = "Picker/down.gif";
        oImg.onmouseover = ClearTimer;
        oImg.onmouseout = SetTimer;
    }

    function OnOverCell()
    {
        var srcCell = window.event.srcElement;
        if (srcCell.className == "pickerInMonthDay")
            srcCell.className = "pickerInMonthDayH";
        if (srcCell.className == "pickerOutMonthDay")
            srcCell.className = "pickerOutMonthDayH";
        if (srcCell.className == "pickerMonth")
        {
            srcCell.className = "pickerMonthH";
            ClearTimer();
        }
    }

    function OnOutCell()
    {
        var srcCell = window.event.srcElement;
        if (srcCell.className == "pickerInMonthDayH")
            srcCell.className = "pickerInMonthDay";
        if (srcCell.className == "pickerOutMonthDayH")
            srcCell.className = "pickerOutMonthDay";
        if (srcCell.className == "pickerMonthH")
        {
            srcCell.className = "pickerMonth";
            SetTimer();
        }
    }

    function OnShowMonths()
    {
        if (bDragging)
            return;
        HidePanels();
        objDivMonths.style.display = "block";
        objDivMonths.style.left = objDivDays.style.pixelLeft + (objDivDays.offsetWidth - objDivMonths.offsetWidth)/2;
        objDivMonths.style.top = objDivDays.style.pixelTop + objDivDays.offsetHeight;
        SetTimer();    
    }

    function OnShowYears()
    {
        if (bDragging)
            return;
        HidePanels();
        objDivYears.style.display = "block";
        objDivYears.style.left = objDivDays.style.pixelLeft + objDivDays.offsetWidth;
        objDivYears.style.top = objDivDays.style.top;
        SetTimer();
    }

    function OnNextMonth()
    {
        OnSelectMonth(nCurMonthIndex + 1);
    }

    function OnPrevMonth()
    {
        OnSelectMonth(nCurMonthIndex - 1);
    }

    function OnSelectMonth(nMonthIndex)
    {
        CancelBuble();
        objDate.setDate(nCurDate);
        objDate.setFullYear(nCurYear);
        objDate.setMonth(nMonthIndex);
        nCurYear = objDate.getFullYear();
        nCurMonthIndex = objDate.getMonth();
        var oCell = objMainContainer.querySelector("#tdPickerDays");
        oCell.firstChild.removeNode(true);
        objMonthTitle.innerText = Months[nCurMonthIndex];
        objYearTitle.innerText = nCurYear;
        RenderDays(oCell);
        SetYears(nCurYear);
    }

    function OnUpYear()
    {
        CancelBuble();
        SetYears(parseInt(objDivYears.querySelector("#tdPickerYear").item(0).innerText) + 10);
    }

    function OnDownYear()
    {
        CancelBuble();
        SetYears(parseInt(objDivYears.querySelector("#tdPickerYear").item(0).innerText) - 10);
    }

    function OnSelectYear()
    {
        CancelBuble();
        nCurYear = parseInt(window.event.srcElement.innerText);
        OnSelectMonth(nCurMonthIndex);
    }

    function OnDragStart()
    {
        HidePanels();
        bDragging = true;
        nClientX = window.event.clientX;
        nClientY = window.event.clientY;
        document.onmousemove = OnDrag;
        document.onmouseup = OnDrop;
    }

    function OnDrag()
    {
        bDragging = true
        var x = window.event.clientX;
        var y = window.event.clientY;
        if (objDivDays.style.filter == "")
            objDivDays.style.filter = "progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=60)";
        objDivDays.style.pixelLeft = objDivDays.style.pixelLeft + x - nClientX;
        objDivDays.style.pixelTop = objDivDays.style.pixelTop  + y - nClientY;
        nClientX = x;
        nClientY = y;
        bDragged = true;
    }

    function OnDrop()
    {
        objDivDays.style.filter = "";
        document.onmouseup = null;
        document.onmousemove = null;
        bDragging = false;
    }

    function OnSelectDate()
    {
        if (bDragged)
        {
            bDragged = false;
            return;
        }
        var oCell = window.event.srcElement;
        objResultDate = arrDates[parseInt(oCell.id)];
        objPicker.objResultInput.value = objResultDate.toLocaleDateString();
        HidePicker();
    }

    function CancelBuble()
    {
        window.event.cancelBubble = true;
    }
    
    function HidePicker()
    {
        HidePanels();
        objDivDays.style.display = "none";
        document.onclick = null;
    }

    function SetYears(nFirstYear)
    {
        var colCells = objDivYears.querySelector("#tdPickerYear");
        var i;
        for (i=0; i<10; i++)
            colCells[i].innerText = nFirstYear - i;
    }

    function ClearTimer()
    {
        if (nPanelsTimer != null)
        {
            window.clearInterval(nPanelsTimer);
            nPanelsTimer = null;
        }
    }

    function SetTimer()
    {
        nPanelsTimer = window.setInterval(HidePanels, 5000);
    }
        
    function HidePanels()
    {
        ClearTimer();
        if (objDivMonths.style.display != "none")
        {
            objDivMonths.style.display = "none";
            return;
        }
        if (objDivYears.style.display != "none")
            objDivYears.style.display = "none";
    }

    function Show(objResultInput)
    {
        CancelBuble();
        objPicker.objResultInput = objResultInput;
        var objEvent = window.event;
        objDivDays.style.left = objEvent.clientX + document.body.scrollLeft;
        objDivDays.style.top = objEvent.clientY + document.body.scrollTop;
        objDivDays.style.display = "block";
        document.onclick = HidePicker;
    }

    function GetDate()
    {
        return objResultDate;
    }
    objPicker = this;        
}