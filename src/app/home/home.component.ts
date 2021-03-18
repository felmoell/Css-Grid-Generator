import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms'
import { concat } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  rowCount: number = 3;
  columnCount: number = 3;
  rowString = "";
  columnString = "";
  t = "{";
  items = ["", "", "", "", "", "", "", "", ""];

  rowForm = this.formBuilder.group({
    name: this.rowCount,
    columnCountInput: this.columnCount,
    columnGapInput: '10',
    rowGapInput: '10',
    rowInputs: this.formBuilder.array([]),
    columnInputs: this.formBuilder.array([]),
  });


  constructor(private formBuilder: FormBuilder,) {
    document.getElementById("body").style.overflow = "hidden";
    document.getElementById("body").style.background = "linear-gradient(to bottom right, #2782DF, #F1ACE6)";
    this.addRowInput();
    this.addRowInput();
    this.addRowInput();
    this.addcolumnInput();
    this.addcolumnInput();
    this.addcolumnInput();

    this.rowForm.get("name").valueChanges.subscribe(selectedValue => {
      if (this.rowInputs.length < selectedValue) {
        while (this.rowInputs.length < selectedValue) {
          this.addRowInput();
          this.rowCount++;
        }
        this.buildGrid();
      } else {
        while (this.rowInputs.length > selectedValue) {
          this.removeRowInput(this.rowCount);
          this.rowCount--;
        }
        this.buildGrid();
      }
    })

    this.rowForm.get("columnCountInput").valueChanges.subscribe(selectedValue => {
      if (this.columnInputs.length < selectedValue) {
        while (this.columnInputs.length < selectedValue) {
          this.addcolumnInput();
          this.columnCount++;
        }
        this.buildGrid();
      } else {
        while (this.columnInputs.length > selectedValue) {
          this.removecolumnInput(this.columnCount);
          this.columnCount--;
        }
        this.buildGrid();
      }
    })

    this.rowForm.valueChanges.subscribe(selectedValue => {
      this.buildGrid();
    })


    this.rowForm.get("columnGapInput").valueChanges.subscribe(selectedValue => {
      this.buildGrid();
    })

    this.rowForm.get("rowGapInput").valueChanges.subscribe(selectedValue => {
      this.buildGrid();
    })
  }


  ngOnInit(): void {
  }

  get rowInputs(): FormArray {
    return this.rowForm.get("rowInputs") as FormArray
  }

  addRowInput() {
    this.rowInputs.push(this.newRowInput());
  }
  removeRowInput(i: number) {
    this.rowInputs.removeAt(i);
  }

  newRowInput(): FormGroup {
    return this.formBuilder.group({
      value: '1fr',
    })
  }

  get columnInputs(): FormArray {
    return this.rowForm.get("columnInputs") as FormArray
  }

  addcolumnInput() {
    this.columnInputs.push(this.newcolumnInput());
  }
  removecolumnInput(i: number) {
    this.columnInputs.removeAt(i);
  }

  newcolumnInput(): FormGroup {
    return this.formBuilder.group({
      value: '1fr',
    })
  }

  getInputValues() {
    let tempRowString = "";
    let tempColumnString = "";

    this.rowForm.value.columnInputs.forEach((element, index) => {
      tempRowString = tempRowString + element.value + " "
    });
    this.rowForm.value.rowInputs.forEach((element, index) => {
      tempColumnString = tempColumnString + element.value + " "
    });

    this.rowString = tempRowString;
    this.columnString = tempColumnString;
  }

  buildGrid() {
    this.getInputValues();
    let ColumnCount = this.rowForm.value.rowInputs.length;
    let RowCount = this.rowForm.value.columnInputs.length;
    let cGap = this.rowForm.value.columnGapInput;
    let rGap = this.rowForm.value.rowGapInput;

    this.items = []
    for (let index = 0; index < ColumnCount * RowCount; index++) {
      this.items.push("");
    }
    document.getElementById("grid").style.gridColumnGap = cGap + "px";
    document.getElementById("grid").style.gridRowGap = rGap + "px";

    if (this.rowString != "" && this.columnString != "") {
      document.getElementById("grid").style.setProperty('grid-template-rows', this.rowString);
      document.getElementById("grid").style.setProperty('grid-template-columns', this.columnString);
    } else {
      document.getElementById("grid").style.setProperty('grid-template-columns', `repeat(${ColumnCount}, 1fr)`);
      document.getElementById("grid").style.setProperty('grid-template-rows', `repeat(${RowCount}, 1fr)`);
    }
  }



  resetGrid() {
    this.rowForm.get("name").setValue(3);
    this.rowForm.get("columnCountInput").setValue(3);
    this.rowForm.get("columnGapInput").setValue(10);
    this.rowForm.get("rowGapInput").setValue(10);
    this.closeDialog();
  }

  onSubmit() {

  }
  closeDialog() {
    document.getElementById("alertWrapper").style.visibility = "hidden";
  }

  openDialog() {
    document.getElementById("alertWrapper").style.visibility = "visible";
  }
  copyToClipboard() {
    if (this.columnString == "" && this.rowString == "") {
      let text = ".grid " + this.t + "\n"
        + "display:grid; \n"
        + "grid-template-columns: repeat(" + this.rowCount + ", 1fr);  \n"
        + "grid-template-rows: repeat(" + this.columnCount + ", 1fr);  \n"
        + "grid-column-gap: " + this.rowForm.value.columnGapInput + "px;  \n"
        + "grid-row-gap: " + this.rowForm.value.rowGapInput + "px;  \n"
        + "} \n";
      navigator.clipboard.writeText(text);
    } else {
      let text = ".grid " + this.t + "\n"
        + "display:grid; \n"
        + "grid-template-columns: " + this.columnString + ";  \n"
        + "grid-template-rows: " + this.rowString + ";  \n"
        + "grid-column-gap: " + this.rowForm.value.columnGapInput + "px;  \n"
        + "grid-row-gap: " + this.rowForm.value.rowGapInput + "px;  \n"
        + "} \n";
      navigator.clipboard.writeText(text);
    }
  }

  openCopy() {
    document.getElementById("codeWrapper").style.visibility = "visible";
  }
  closeCopy() {
    document.getElementById("codeWrapper").style.visibility = "hidden";
  }


}
