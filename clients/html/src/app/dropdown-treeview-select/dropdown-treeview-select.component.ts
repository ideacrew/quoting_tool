import { Component, OnInit } from '@angular/core';
import { SelectedSicService } from '../services/selected-sic.service';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import sicCodes from '../../data/sicCodes.json';

@Component({
  selector: 'app-dropdown-treeview-select',
  templateUrl: './dropdown-treeview-select.component.html',
  styleUrls: ['./dropdown-treeview-select.component.css']
})
export class DropdownTreeviewSelectComponent implements OnInit {
  items: TreeviewItem[];
  sicCodes = sicCodes;

  config = TreeviewConfig.create({
    hasFilter: true,
    hasCollapseExpand: false
  });

  constructor(private selectedSicService: SelectedSicService) {}

  ngOnInit() {
    this.items = this.buildSicTree();
  }

  onValueChange(value: number) {
    console.log('valueChange raised with value: ' + value);
  }

  select(item: TreeviewItem) {
    if (item.children === undefined) {
      this.selectItem(item);
    }
  }

  private selectItem(item: TreeviewItem) {
    this.selectedSicService.changeMessage(item);
  }

  buildSicTree(): TreeviewItem[] {
    // The object that will format data to proper format for treeview
    const parentObject = {
      text: String,
      value: 0,
      collapsed: true,
      children: []
    };

    const availableItems = [];
    const divisionLabels = [];
    const majorGroupLabels = [];
    const industryGroupLabels = [];
    const standardIndustryCodes = [];
    this.sicCodes.map((sic) => {
      // Generates Division Labels options
      if (!divisionLabels.includes(sic['Division_Label'])) {
        divisionLabels.push(sic['Division_Label']);
      }
      // Generates Major Group Labels options
      if (!majorGroupLabels.includes({ text: sic['MajorGroup_Label'] })) {
        majorGroupLabels.push({
          key: sic['Division_Label'],
          text: sic['MajorGroup_Label'],
          code: sic['MajorGroup_Code'].split(' ')[2],
          collapsed: true
        });
      }
      // Generates Industry Group Labels options
      if (!industryGroupLabels.includes({ text: sic['IndustryGroup_Label'] })) {
        industryGroupLabels.push({
          key: sic['MajorGroup_Label'],
          text: sic['IndustryGroup_Label'],
          value: sic['IndustryGroup_Code'].split(' ')[2],
          collapsed: true
        });
      }
      // Generates Standard Industry Code options
      if (
        !standardIndustryCodes.includes({
          value: sic['StandardIndustryCode_Code']
        })
      ) {
        standardIndustryCodes.push({
          key: sic['IndustryGroup_Label'],
          text: sic['StandardIndustryCode_Full'],
          value: sic['StandardIndustryCode_Code'],
          collapsed: true
        });
      }
    });
    // Maps division options to treeview format
    divisionLabels.map((divisionLabel, index) => {
      parentObject.text = divisionLabel;
      parentObject.value = index;
      // Maps Major Group Label options to treeview format and gets unique options
      const groupLabels = majorGroupLabels
        .filter((mgl) => mgl.key === divisionLabel)
        .filter((thing, i, self) => self.findIndex((t) => t.text === thing.text) === i);
      parentObject.children = groupLabels;
      // Maps Industry Group Label options to treeview format and gets unique options
      parentObject.children.map((child) => {
        const igLabels = industryGroupLabels
          .filter((igl) => igl.key === child.text)
          .filter((thing, i, self) => self.findIndex((t) => t.text === thing.text) === i);
        child['children'] = igLabels;
        // Maps Standat Industry Code options to treeview format
        child.children.map((kid) => {
          const iCodes = standardIndustryCodes.filter((sic) => sic.key === kid.text);
          kid['children'] = iCodes;
        });
      });

      let name = divisionLabel + index;
      // @ts-ignore
      name = new TreeviewItem(parentObject);
      availableItems.push(name);
    });

    return availableItems;
  }
}
