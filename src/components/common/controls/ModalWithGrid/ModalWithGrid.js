import * as React from 'react';
import { CustomGrid, Button, ConfirmModal } from '@carrier/ngecat-reactcomponents';
import { columnType } from '@carrier/workflowui-globalfunctions';
import BuilderMenu from '../builderList/builderMenu';

const ModalWithGrid = (props) => {
    const { showComponent, showDialogLoading, dropDownDetails, modalDetails, gridDetails,
        fullWidth = false, children, button = {}, buttonType = columnType.dropdown } = props;
    const createButtonElement = () => {
        switch (buttonType) {
            case columnType.dropdown:
                return (
                    <BuilderMenu
                        dropdownMenuClass="projectInfoSelectionLeftMargin"
                        filteredBy={dropDownDetails.additionalCheck}
                        clickHandler={dropDownDetails.toggleDialogue}
                        buttonProps={{ name: dropDownDetails.name, id: dropDownDetails.id, iconProps: { icon: dropDownDetails.icon, className: dropDownDetails.className } }}
                    />
                );
            case columnType.button:
                const id = button.id ? `${button.id.split(' ').join('_')}` : '';
                return (
                    <Button
                        name={button.value}
                        styles={(button.disabled) ? "eButtonDisable" : "eButton cmdbar-right"}
                        onClick={(event) => button.onClick && button.onClick(event)}
                        icon={button.icon}
                        id={id}
                    />
                );
            default:
                return null;
        }
    }

    return (<>
        {showComponent &&
            <>
                { createButtonElement()}
                <ConfirmModal
                    isModalOpen={modalDetails.open}
                    title={modalDetails.title}
                    actionButtonList={modalDetails.actionButtonList}
                    onClose={modalDetails.onClose}
                    errorMsg={modalDetails.errorMsg}
                    fullWidth={fullWidth}
                >
                    {children ||
                        <CustomGrid
                            rows={gridDetails.rowData}
                            headCells={gridDetails.headerData}
                            showCheckbox={gridDetails.showCheckbox}
                            orderByfield={gridDetails.orderByfield}
                            uniqueKey={gridDetails.uniqueKey}
                            sortable
                            hideSearch
                            rowCheckboxHandler={gridDetails.selectedRecordsHandler}
                            rowsPerPageOptions={[5, 10, 20, 100]}
                            config={gridDetails.config || {}}
                            rowsToShowPerPage={100}
                            isLoading={showDialogLoading}
                            singleSelectGrid={gridDetails.singleSelectGrid}
                            doNotTranslate={false}
                        />
                    }
                </ConfirmModal>
            </>
        }
    </>
    );
}

export default ModalWithGrid;