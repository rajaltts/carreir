import React, { useEffect, useState, useContext } from "react";
import { injectIntl } from "react-intl";
import { withStyles } from "@material-ui/core/styles";
import { translation } from "@carrier/ngecat-reactcomponents";
import { MenuItem, FormControl, Select, Checkbox } from "@material-ui/core";
import { injectIntlTranslation } from "@carrier/workflowui-globalfunctions";
import multiTagFilterStyles from './multiTagFilterStyles';
import { MultiTagContext } from '../multiTagContext'
const CustomColorCheckbox = withStyles({
    root: {
        color: "#617080",
        padding: "5px 8px 5px 0px",
        "&$checked": {
            color: "#1891F6"
        },
    },
    checked: {}
})((props) => <Checkbox color="default" {...props} />);

const MultiTagFilters = (props) => {
    const { intl } = props
    const { tagsFilter, setFilteredProducts } = useContext(MultiTagContext)
    const { wrapper, formControl, groupControl, menuItem, checkboxControl, paperMenu } = multiTagFilterStyles();
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [groupList, setGroupList] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]); 
    const [selectedFilters, setSelectedFilters] = useState({}); 
    const AllProducts = injectIntlTranslation(intl, "All Products")
    const AllGroups = injectIntlTranslation(intl, "All Groups")

    useEffect(() => {
        setSelectedProducts(Object.keys(tagsFilter));
        setGroupFilters([...new Set([].concat(...Object.values(tagsFilter).map((o) => o)))])
        setSelectedFilters({ "All": "All" })
    }, [tagsFilter]);

    useEffect(()=>{
        setFilteredProducts(selectedFilters)
    },[selectedFilters])

    const setGroupFilters = (groups) => {
        setGroupList(groups)
        setSelectedGroups(groups)
    }
    
    const filteredArray = (id,list) =>{
        let filterArr = {};
        let filterGroups = [];
        for (let key in tagsFilter) {
            if(id === "productId"){
                if (list.includes(key)) {
                    filterGroups = [...filterGroups, ...[...new Set(tagsFilter[key])]]
                    filterArr[key] = key;
                }
            }
            else{
                var obj = tagsFilter[key];
                if (selectedProducts.includes(key)) {
                    obj.forEach((val) => {
                        if (list.includes(val)) {
                            filterArr[key] = key
                        }
                    })
                }
            }
        }
        return {filterArr, filterGroups}
    }

    const changeTagFilters = (event, lists, selectedList, id) => {
        const { target: { value } } = event;
        const products = Object.keys(tagsFilter);
        const { filterArr, filterGroups } = filteredArray(id, lists)
        if (value === AllProducts || value === AllGroups) {
            if (id === "productId") {
                setSelectedProducts(selectedList.length === products.length ? [] : Object.keys(filterArr));
                setGroupFilters(selectedList.length === products.length ? [] : filterGroups)
                setSelectedFilters(selectedList.length === products.length ? {} : { "All": "All" })
            }
            else {
                setSelectedGroups(selectedList.length === groupList.length ? [] : groupList);
                setSelectedFilters(selectedList.length === groupList.length ?  {} : filterArr)
            }
        }
        else {
            let list = [...selectedList];
            const index = list.indexOf(value);
            index === -1 ? list.push(value) : list.splice(index, 1);
            const { filterArr, filterGroups } = filteredArray(id, list)
            if (id === "productId") {
                (list.length === products.length) ? setSelectedProducts(products) : setSelectedProducts(list);
                setSelectedFilters(list.length === products.length ? { "All": "All" } : filterArr)
                setGroupFilters(filterGroups)
            }
            else {
                const currentProductsSelected = Object.keys(filterArr);
                (list.length === groupList.length) ? setSelectedGroups(groupList) : setSelectedGroups(list);
                setSelectedFilters((list.length === groupList.length && currentProductsSelected.length === products.length) ? { "All": "All" } : filterArr)
            }
        }
    }

    const renderSelection = (selected, id) => {
        return !selected.length ?
            (id === 'productId') ? translation("ProductFilter") : translation("GroupFilter")
            : selected.join(", ")
    }

    const formControlSelect = (id, defaultValue, lists, selectedList) => {
        const isAllChecked = lists.length > 0 && selectedList.length === lists.length;
        return <Select
            labelId={id + "label"}
            id={id}
            multiple
            displayEmpty
            value={isAllChecked ? [defaultValue] : selectedList}
            MenuProps={{
                classes: { paper: paperMenu },
                variant: 'menu',
                getContentAnchorEl: null,
                autoFocus: true
            }}
            inputProps={{ 'aria-label': 'Without label' }}
            disableUnderline
            renderValue={(selected) => {
                return renderSelection(selected, id)
              }}
        >
            {
                menuItemFunc(defaultValue, lists, selectedList, isAllChecked, id)
            }
            {
                !!lists.length && lists.map((val) => {
                    let check = selectedList.includes(val)
                    return menuItemFunc(val, lists, selectedList, check, id)
                })
            }
        </Select>
    }

    const menuItemFunc = (value, lists, selectedList, check, id) => {
        return <MenuItem className={menuItem}>
            <CustomColorCheckbox value={value}
                className={checkboxControl}
                onChange={(event) => { changeTagFilters(event, lists, selectedList, id) }}
                checked={check} />
            <span>{value}</span>
        </MenuItem>
    }
    return (
        <div id="MultiTagFilters" className={wrapper}>
            <FormControl className={formControl}>
                {
                    formControlSelect("productId", AllProducts, Object.keys(tagsFilter), selectedProducts)
                }
            </FormControl>
            {!!selectedProducts.length &&
                <FormControl className={groupControl}>
                    {
                        formControlSelect("groupId", AllGroups, groupList, selectedGroups)
                    }
                </FormControl>
            }
        </div>
    );
};

export default injectIntl(MultiTagFilters);