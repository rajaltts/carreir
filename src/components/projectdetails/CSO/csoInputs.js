import React, { Component } from 'react'
import { connect } from 'react-redux';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { AssignDefault, FilterAndReconfigure, ApiService, MergeAssignments, GetInitialState } from '@carrier/workflowui-globalfunctions';
import { TextBoxWithLabel, translation, ConfirmModal } from '@carrier/ngecat-reactcomponents';
import appConfig from '../../../Environment/environments';
import { ESCAPEDPROPERTIES } from '../../../utilities/constants/Constants'
import { endPoints } from "@carrier/workflowui-globalfunctions";

class CsoInputs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredData: [],
      FilteredConfigurationInput: [],
      initialLoad: false,
      csoNbrPoints: [],
      valid: false,
      selectedModel: ''
    };
    this.handleChange = this.handleChange.bind(this)
    this.onNewAssignment = this.onNewAssignment.bind(this)
    this.saveCsoInputValues = this.saveCsoInputValues.bind(this)
    this.getIntialValues = this.getIntialValues.bind(this)
  }

  componentDidMount() {
    let TagData = this.props.TagData;
    let FilterAndReconfigureData = JSON.parse(sessionStorage.getItem(`${this.props.TagData.TagId} FilterAndReconfigure`));
    let selectedModel = JSON.parse(sessionStorage.getItem(`${this.props.TagData.TagId} SelectedModel`));
    this.setState({
      filteredData: FilterAndReconfigureData ? FilterAndReconfigureData : {}
    })
    if (!FilterAndReconfigureData) {
      this.getIntialValues(TagData)
    }
    else {
      this.onNewAssignment("data", selectedModel)
    }
  }
  getIntialValues(TagData) {
    let selectedModel;
    let productLine = this.props.productLine ? this.props.productLine : 'PCU_EMEA'
    ApiService(`${appConfig.api.eCatAppService}${endPoints.GET_TAG_CONFIGURATION}tagId=${TagData.TagId}`, 'GET').then(res => {
      let ConfigurationInput = res.data.ConfigurationInput;                
      let ConfigurationInputDuplicateArray = Array.from(new Set(ConfigurationInput.map(JSON.stringify))).map(JSON.parse);
      let FilteredConfigurationInput = ConfigurationInputDuplicateArray.filter( item => 
        item.Value !== "" && item.Value !== null && item.Value !== undefined)
      FilterAndReconfigure(appConfig.api.rulesAppServices, productLine, 'Selection', "CSO",null, FilteredConfigurationInput, []).then(result => {
        selectedModel = result.VariableDomains && result.VariableDomains.filter( item => item.Name === "Sel_sConfRuleset")[0].Value;
        GetInitialState(appConfig.api.rulesAppServices, productLine, selectedModel, "CSO", null, FilteredConfigurationInput)
        .then(data => {
          this.setState({selectedModel})
          this.onNewAssignment(AssignDefault(data, [ESCAPEDPROPERTIES]), selectedModel)
        })
      })
    })
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  onNewAssignment( csoInputsObject, selectedModel ) {
    let FilteredConfigurationInput;
    if(JSON.parse(sessionStorage.getItem('FilteredConfigurationInput'))) {
      FilteredConfigurationInput = JSON.parse(sessionStorage.getItem('FilteredConfigurationInput'));
    }
    else {
      FilteredConfigurationInput = [];
    }
    if (csoInputsObject === "data") {
      this.setState({ 
        filteredData: JSON.parse(sessionStorage.getItem(`${this.props.TagData.TagId} FilterAndReconfigure`)),
        selectedModel
      }, () => {
        this.setState({ initialLoad: true })
      })
    }
    else {
      MergeAssignments(csoInputsObject, FilteredConfigurationInput).then((data) => {
        this.setState({ csoNbrPoints:  data})
        FilterAndReconfigure(appConfig.api.rulesAppServices, this.props.productLine ? this.props.productLine : 'PCU_EMEA', selectedModel ? selectedModel:this.state.selectedModel, "CSO",null, data, []).then(result => {
          let res = this.CheckFeasibility(result, "CSO")
          this.setState({ valid: res.IsInvalid})
          this.setState({ filteredData: result }, () => {
            sessionStorage.setItem('FilteredConfigurationInput', JSON.stringify(FilteredConfigurationInput.length ? FilteredConfigurationInput: csoInputsObject));
            this.setState({ initialLoad: true })
          })
        })
      })
    }
  }
  CheckFeasibility(RulesJSON, Tag) {
    let InvalidRangeProps = []
    let RelaxedProps = []
    RulesJSON.VariableDomains.forEach(prop => {
      if (!prop.Name.includes(".") && prop.Type === 2) {
        let Visible = RulesJSON.VariableDomains.find(property => property.Name === (prop.Name + '.VISIBLE'))
        let MinProp = RulesJSON.VariableDomains.find(property => property.Name === (prop.Name + '.MIN'))
        let MaxProp = RulesJSON.VariableDomains.find(property => property.Name === (prop.Name + '.MAX'))
        if (prop.Name === "CSO_nNbrCSOPoints" || prop.Name === "CSO_fEnterCondTemp1" || prop.Name === "CSO_fEnterCondTemp2") {
          if (prop.Value !== "" && MinProp && MaxProp) {
            if (MinProp.Value !== "" && MaxProp.Value !== "" && (Number(MinProp.Value) > Number(prop.Value) || Number(MaxProp.Value) < Number(prop.Value)))
              InvalidRangeProps.push({ PropName: prop.Name, Value: prop.Value, Min: MinProp.Value, Max: MaxProp.Value })
          }
        }
        if (prop.Value !== "" && MinProp && MaxProp && Visible) {
          if (Visible.Value === "TRUE" && MinProp.Value !== "" && MaxProp.Value !== "" && (Number(MinProp.Value) > Number(prop.Value) || Number(MaxProp.Value) < Number(prop.Value)))
            InvalidRangeProps.push({ PropName: prop.Name, Value: prop.Value, Min: MinProp.Value, Max: MaxProp.Value })
        }
      }
    })
    if (RulesJSON.RelaxedVarNames.length > 0) {
      RulesJSON.RelaxedVarNames.forEach(prop => {
        let JSONProp = RulesJSON.VariableDomains.find(Property => Property.Name === prop)
        if (JSONProp && (!Tag || (Tag && JSONProp.Tags.find(tag => tag === Tag))))
          RelaxedProps.push(JSONProp)
      });
    }
    return { Tag: Tag, IsInvalid: (InvalidRangeProps.length > 0 || RelaxedProps.length > 0), RelaxedProps: RelaxedProps, InvlidRangeProps: InvalidRangeProps }
  }
  saveCsoInputValues(e) {
    let csoNbrPoints = [];
    csoNbrPoints = this.state.csoNbrPoints.length ? this.state.csoNbrPoints : JSON.parse(sessionStorage.getItem('FilteredConfigurationInput'));
    let itemValue = csoNbrPoints.filter(item => item.Name === "CSO_nNbrCSOPoints")[0];
    let arrItems=[];
    let filteredItems = [];
    // eslint-disable-next-line array-callback-return
    csoNbrPoints.filter(item => {
      if (item.Name.startsWith("CSO_fEnterCondTemp")) {
        arrItems.push(item)     
      }
    })
    for (let index = 0; index < itemValue.Value; index++) {
      filteredItems.push(arrItems[index])
    }
    sessionStorage.setItem(`${this.props.TagData.TagId} FilterAndReconfigure`, JSON.stringify(this.state.filteredData));
    sessionStorage.setItem(`${this.props.TagData.TagId} SelectedModel`, JSON.stringify(this.state.selectedModel));
    this.props.csoInputsDialouge();
    sessionStorage.setItem('filteredItems', JSON.stringify(filteredItems));
    sessionStorage.setItem('noOfInputs', JSON.stringify(itemValue));
    this.props.saveCsoInputValues(filteredItems, itemValue);
  }

createCSOInputFooterButtons = () => {
  return [
      {
          name: translation("Save", "Save"),
          icon: faSave,
          onClick: this.saveCsoInputValues,
          disabled: this.state.valid || !this.state.initialLoad
      }
  ];
}

  render() {
    return (
      <>
        <ConfirmModal 
          isModalOpen={true}
          title={translation("CSOinputs")}
          onClose={this.props.csoInputsDialouge}
          fullWidth={100}
          actionButtonList={this.createCSOInputFooterButtons()}
          >
            <div className="csoInputs-block">
              {this.state.initialLoad ?
                <>
                  <div className="k-form-field">
                    <div className="dialog-dimensions">
                      <span>{translation("ModifyPerformanceMapforTag")}</span>
                    </div>
                    <div className="message dialog-dimensions">
                      <span className="modify-performance-map-for-tag"> {this.props.TagData.TagName} </span>
                    </div>
                  </div>
                  <div className="k-form-field inputs-given border-bottom-line">
                    <div className="dialog-dimensions">
                      <span>{translation("NumberofCSOpoints")}</span>
                    </div>
                    <div className="no-of-inputs">
                      <TextBoxWithLabel 
                        PropName="CSO_nNbrCSOPoints"
                        Visible="CSO_nNbrCSOPoints.VISIBLE"
                        RulesJSON={this.state.filteredData} 
                        onValueChanged={this.onNewAssignment} 
                        unitSystem={this.props.lang.unit}
                      />
                    </div>
                  </div>
                  <div className="k-form-field">
                    <div className="dialog-dimensions">
                      <span>{translation("EnteringCondenserTemp")}</span>
                    </div>
                  </div>
                  <div className="k-form-field min-max">
                    <div className="dialog-dimensions dimensions-min-max">
                      <span className="min-max-label">{translation("CsoMax")}</span>
                    </div>
                    <div className="message">
                        <TextBoxWithLabel 
                          PropName="CSO_fEnterCondTemp1"
                          Visible="CSO_fEnterCondTemp1.VISIBLE"
                          RulesJSON={this.state.filteredData} 
                          onValueChanged={this.onNewAssignment} 
                          unitSystem={this.props.lang.unit}
                        />
                    </div>
                  </div>
                  <div className="k-form-field min-max">
                    <div className="dialog-dimensions dimensions-min-max">
                      <span className="min-max-label">{translation("CsoMin")}</span>
                    </div>
                    <div className="message">
                      <TextBoxWithLabel 
                        PropName="CSO_fEnterCondTemp2"
                        Visible="CSO_fEnterCondTemp2.VISIBLE"
                        RulesJSON={this.state.filteredData}
                        onValueChanged={this.onNewAssignment} 
                        unitSystem={this.props.lang.unit}
                      />
                      <TextBoxWithLabel 
                        PropName="CSO_fEnterCondTemp3"
                        Visible="CSO_fEnterCondTemp3.VISIBLE" 
                        RulesJSON={this.state.filteredData} 
                        onValueChanged={this.onNewAssignment} 
                        unitSystem={this.props.lang.unit}
                      />
                      <TextBoxWithLabel 
                        PropName="CSO_fEnterCondTemp4"
                        Visible="CSO_fEnterCondTemp4.VISIBLE"
                        RulesJSON={this.state.filteredData} 
                        onValueChanged={this.onNewAssignment} 
                        unitSystem={this.props.lang.unit}
                      />
                      <TextBoxWithLabel 
                        PropName="CSO_fEnterCondTemp5"
                        Visible="CSO_fEnterCondTemp5.VISIBLE"
                        RulesJSON={this.state.filteredData} 
                        onValueChanged={this.onNewAssignment} 
                        unitSystem={this.props.lang.unit}
                      />
                      <TextBoxWithLabel 
                        PropName="CSO_fEnterCondTemp6"
                        Visible="CSO_fEnterCondTemp6.VISIBLE"
                        RulesJSON={this.state.filteredData} 
                        onValueChanged={this.onNewAssignment} 
                        unitSystem={this.props.lang.unit}
                      />
                    </div> 
                  </div>
                 
                </>
                  :
                <div>{translation("Loading")}</div>
              }
            </div>
        </ConfirmModal>
      </>
    )
  }
}
const mapStateToProps = state => ({
  lang: state.locale,
});
export default connect(mapStateToProps, {})(CsoInputs);