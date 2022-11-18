import React, { useEffect, useState } from "react";
import { injectIntl } from "react-intl";
import ReplyIcon from "@material-ui/icons/Reply";
import { ConfirmModal } from "@carrier/ngecat-reactcomponents";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import ProjectShareStyles from "../../dashboard/projectList/projectShare/ProjectShareStyles";
import AvatarSingle from "./avatars/AvatarSingle";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { projectAccessTypeRoles } from "@carrier/workflowui-globalfunctions";
import FormControl from "@material-ui/core/FormControl";
import { injectIntlTranslation, showLoader, hideLoader, showSuccessNotification, showErrorNotification,
    refreshProjectList } from "@carrier/workflowui-globalfunctions";
import classnames from 'classnames';
import { connect } from "react-redux";
import { ApiService, endPoints } from "@carrier/workflowui-globalfunctions";
import appConfig from '../../../Environment/environments';
import { debounce } from 'lodash';
import { getLoaderText } from "../../projectdetails/tagDetails/tagGrid/tagActions/TagActionUtil";
import CustomButton from "./CustomButton";
import CircularProgress from '@material-ui/core/CircularProgress';

const ProjectShareIcon = (props) => {
    const classes = ProjectShareStyles();
    return (
        <div className={classnames(classes.shareIcon, props.className)}>
            <ReplyIcon />
        </div>
    )
}

const ProjectShareDialog = (props) => {
    const { isModalOpen, onProjectShareClose, intl, projectDetail: { SharedUserList, ProjectID, OwnerName, CreatedBy }, appName, showLoader, 
    showSuccessNotification, showErrorNotification, refreshProjectList } = props;
    const classes = ProjectShareStyles();
    const [shareAccessModifier, setShareAccessModifier] = useState("Viewer");
    const { Viewer, Editor, Admin } = projectAccessTypeRoles;
    const projectAccessRoles = {
        Admin,
        Editor,
        Viewer,
    };
    const [usersSelectedForShare, setUsersSelectedForShare] = useState([]);
    const menuStyle = { zIndex: 9999999, padding: 0 };
    const menuListStyle = { padding: 0 };
    const [users, setUsers] = useState([]);
    const [cachedUsersList, setCachedUsersList] = useState([]);
    const [sharedUsers, setSharedUsers] = useState(SharedUserList);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const projectSharedStatus = {
        alreadyShared: "alreadyShared",
        toShare: "toShare",
    };
    const [userSearchText, setUserSearchText] = useState("");
    const projectOwnerDetails = JSON.parse(OwnerName);
    projectOwnerDetails.Role =  "Owner";
    const [modifyRoleLoadingIndex, setModifyRoleLoadingIndex] = useState(null);

    const getUsersByAppName = async (searchString = "") => {
        setLoadingUsers(true);
        const url = `${appConfig.api.userManagement}${endPoints.GET_USERS_BY_APPNAME}`;
        const postData = {
            AppName: appName,
            PageSize: "100",
            PageNo: 1,
            SearchStr: searchString,
        };
        try {
            const { data } = await ApiService(url, 'POST', postData);
            const sharedUserIds = SharedUserList.map(user => user.UserId);
            sharedUserIds.push(CreatedBy);
            const updatedData = data.filter(userData => !sharedUserIds.includes(userData.objectId));
            setUsers(updatedData);
            if (!cachedUsersList.length) {
                setCachedUsersList(updatedData);
            }
            setLoadingUsers(false);
        } catch(error) {
            showErrorNotification(error.message);
            setLoadingUsers(false);
        }
    }

    const onUserSearch = debounce((searchString) => {
        getUsersByAppName(searchString);
    }, 300);

    useEffect(() => {
        getUsersByAppName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    

    const assignRolesToUserData = (userObject, changedRole) => {
        userObject.PreviousRole = userObject.Role;
        userObject.CurrentRole = changedRole === "Remove" ? "" : changedRole;
        userObject.Role = changedRole;
        return userObject;
    }

    const handleAccessChange = (event) => {
        const { value: changedRole, index: changedIndex } = event;
        const projectSharedUsers = sharedUsers.slice();
        if (changedRole !== "Remove") {
            projectSharedUsers[changedIndex] = assignRolesToUserData(projectSharedUsers[changedIndex], changedRole);
        } else {
            projectSharedUsers[changedIndex] = assignRolesToUserData(projectSharedUsers[changedIndex], changedRole);
        }
        const postData = {
            ProjectId: ProjectID,
            Users: [projectSharedUsers[changedIndex]],
        };
        setSharedUsers(projectSharedUsers);
        setModifyRoleLoadingIndex(changedIndex);
        postProjectInviteData(postData, false, changedRole === "Remove" ? changedIndex : null);
    };

    const getAccessRoleSelectedClass = (
        userDataIndex,
        role,
        shareStatus
    ) => {
        if (shareStatus === projectSharedStatus.toShare) {
            if (shareAccessModifier === role) {
                return classes.userNameSelected;
            }
        } else {
            if (sharedUsers[userDataIndex]?.Role === role) {
                return classes.userNameSelected;
            }
        }
        return classes.roleMenuItem;
    };

    const handleShareAccessChange = (event) => {
        setShareAccessModifier(event.target.value);
    };

    const handleUserSearch = (event) => {
        const { target: { value } } = event;
        setUserSearchText(value);
        onUserSearch(value);
    }

    const handleUserSelect = (event, value) => {
        setUsers(cachedUsersList);
        setUsersSelectedForShare(value);
    };

    const postProjectInviteData = async (postData, closePopup, changedIndex) => {
        try {
            if (closePopup) {
                onProjectShareClose(false);
                showLoader(getLoaderText({intl, title: injectIntlTranslation(intl, "ProjectInvite")}), false);
            }
            const url = `${appConfig.api.eCatApimAppService}${endPoints.SHARE_PROJECT}`;
            await ApiService(url, 'POST', postData);
            refreshProjectList();
            if (!closePopup) {
                if (changedIndex !== null) {
                    const projectSharedUsers = sharedUsers.slice();
                    projectSharedUsers.splice(changedIndex, 1);
                    setSharedUsers(projectSharedUsers);
                }
                setModifyRoleLoadingIndex(null);
                return;
            }
            showSuccessNotification(injectIntlTranslation(intl, "ProjectInvitationSuccessful"));
        } catch(error) {
            showErrorNotification(error.message);
        }
    }

    const handleShareProjectClick = async () => {
        const selectedUsersRequest = usersSelectedForShare.map(user => {
            const updatedUserData = {};
            Object.keys(user).forEach(key => {
                if (key === "objectId") {
                    updatedUserData["UserId"] = user[key];
                } else {
                    const upperCaseKey = key.charAt(0).toUpperCase() + key.slice(1);
                    updatedUserData[upperCaseKey] = user[key];
                }
                updatedUserData.PreviousRole = "";
                updatedUserData.CurrentRole = shareAccessModifier;
            });
            return updatedUserData;
        });
        const postData = {
            ProjectId: ProjectID,
            Users: selectedUsersRequest,
        };
        postProjectInviteData(postData, true);
    };

    const handleUserSelectClose = () => {
        setUsers(cachedUsersList);
    }

    const filterUserOptions = (options, state) => {
        return options.filter(
            (option) =>
                option.firstName.toLowerCase().includes(state.inputValue.toLowerCase()) ||
                option.lastName.toLowerCase().includes(state.inputValue.toLowerCase()) ||
                option.email.toLowerCase().includes(state.inputValue.toLowerCase())
        );
    };

    const getUsersSelected = (option, value) => {
        return option.objectId === value.objectId;
    }

    const renderProjectAccessRoles = (userDataIndex, shareStatus) => {
        return Object.keys(projectAccessRoles).map((role) => {
            return (
                <MenuItem
                    id={"access-role" + role}
                    key={role}
                    value={role}
                    classes={{
                        root: getAccessRoleSelectedClass(
                            userDataIndex,
                            role,
                            shareStatus
                        ),
                        gutters: classes.menuItemSelectedGutters,
                    }}
                    ListItemClasses={{
                        selected: classes.menuItemSelected,
                    }}
                >
                    {role}
                </MenuItem>
            );
        });
    };

    const renderSharedWith = () => {
        const sharedWithDetails = (
            <div>
                {renderSharedWithRow(projectOwnerDetails, 0, "hideAccessModify")}
                {sharedUsers.map((user, index) =>
                    renderSharedWithRow(user, index)
                )}
            </div>
        );
        return sharedWithDetails;
    };

    const renderUserSelectInput = (params) => (
        <TextField
            {...params}
            classes={{
                root: classes.userSearchInputField,
            }}
            variant="outlined"
            label={usersSelectedForShare.length || userSearchText ? "" : "Email, name…"}
            size="small"
            onChange={handleUserSearch}
            InputLabelProps={{ shrink: false }}
            onBlur={() => setUserSearchText("")}
            InputProps={{
                ...params.InputProps,
                endAdornment: (
                    <div className={`${!usersSelectedForShare.length ? classes.hideUserShareSelectedAccess : classes.userShareSelectedAccess}`}>
                        <FormControl>
                            {usersSelectedForShare.length ? (
                                <Select
                                className={
                                    classes.sharedProjectAccessSelect
                                }
                                id={`user-access-change-select`}
                                value={shareAccessModifier}
                                onChange={handleShareAccessChange}
                                classes={{
                                    root: classes.userName,
                                }}
                                disableUnderline
                                MenuProps={{
                                    anchorOrigin: {
                                        vertical: "bottom",
                                        horizontal: "left",
                                    },
                                    transformOrigin: {
                                        vertical: "top",
                                        horizontal: "left",
                                    },
                                    getContentAnchorEl: null,
                                    style: {
                                        zIndex: 9999999,
                                        padding: 0,
                                    },
                                    MenuListProps: {
                                        style: {
                                            padding: 0,
                                        },
                                    },
                                }}
                                >
                                    {renderProjectAccessRoles(
                                        null,
                                        projectSharedStatus.toShare
                                    )}
                                </Select>
                            ) : null}
                        </FormControl>
                    </div>
                ),
            }}
        />
    );

    const getObjectUpperCaseKeys = (data) => {
        const updatedData = {};
        Object.keys(data).forEach(key => {
            const upperCaseKey = key.charAt(0).toUpperCase() + key.slice(1);
            updatedData[upperCaseKey] = data[key];
        });
        return updatedData;
    }

    const getUserDetailRow = (userDetail, showEmail) => {
        return (
            <div key={userDetail.FirstName} className={classes.userDetailsRow}>
                <div>
                    <AvatarSingle
                        avatarText={`${userDetail.FirstName[0]}${userDetail.LastName[0]}`}
                    />
                </div>
                {showEmail ? (
                    <div className={classes.userDetailsContainer}>
                    <span
                        className={classes.userName}
                    >{`${userDetail.FirstName} ${userDetail.LastName}`}</span>
                    <span className={classes.userEmail}>{userDetail.Email}</span>
                </div>
                ) : (
                    <div>
                        <span
                            className={`${classes.userName} ${classes.userNameMarginLeft}`}
                        >{`${userDetail.FirstName} ${userDetail.LastName}`}</span>
                    </div>
                )}
                
            </div>
        )
    }

    const getOptions = (option) => {
        const optionStyled = (
            getUserDetailRow(getObjectUpperCaseKeys(option), true)
        );
        return optionStyled;
    };

    const renderSharedWithRow = (user, index, hideAccessModify = "") => {
        return (
            <div
                key={user.FirstName}
                className={classes.sharedWithListForDialog}
            >
                {getUserDetailRow(user, false)}
                <div>
                    {!hideAccessModify ? (
                        <div className={classes.modifyAccessContainer}>
                            {modifyRoleLoadingIndex === index ? <CircularProgress color="inherit" size={15} /> : null}
                            <Select
                                className={classes.sharedWithAccessSelect}
                                id={`${user.FirstName}-access-change-select`}
                                value={user.Role}
                                defaultValue={user.Role}
                                onChange={({ target: { value } }) =>
                                    handleAccessChange({ value, index })
                                }
                                disabled={modifyRoleLoadingIndex === index}
                                disableUnderline
                                classes={{
                                    root: classes.userName,
                                }}
                                MenuProps={{
                                    anchorOrigin: {
                                        vertical: "bottom",
                                        horizontal: "left",
                                    },
                                    transformOrigin: {
                                        vertical: "top",
                                        horizontal: "left",
                                    },
                                    getContentAnchorEl: null,
                                    style: menuStyle,
                                    MenuListProps: {
                                        style: menuListStyle,
                                    },
                                }}
                            >
                                {renderProjectAccessRoles(
                                    index,
                                    projectSharedStatus.alreadyShared
                                )}
                                <MenuItem
                                    id={"access-remove"}
                                    key={"remove"}
                                    value={"Remove"}
                                    classes={{
                                        root: classes.removeAccessMenuItem,
                                    }}
                                >
                                    Remove
                                </MenuItem>
                            </Select>
                        </div>
                    ) : (
                        <div
                            className={`${classes.userName} ${classes.userNameMarginRight}`}
                        >
                            {user.Role}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <ConfirmModal
            isModalOpen={isModalOpen}
            title={injectIntlTranslation(intl, "ShareWithPerson")}
            fullWidth
            onClose={onProjectShareClose}
            hideCancel
            headerIcon={ProjectShareIcon}
            errorMsg={""}
            contentClassName={classes.shareContentContainer}
            modalWidth={"xs"}
        >
            <div>
                <div className={classes.userInviteDetails}>
                    <div className={classnames(classes.infoProject, classes.helperText)}>
                        {injectIntlTranslation(
                            intl,
                            "LastEdited100Users",
                            "Last 100 edited users"
                        )}
                    </div>
                    <div className={classes.userInviteContainer}>
                        <div className={classes.userSearchContainer}>
                            <Autocomplete
                                multiple
                                id="select-user"
                                classes={{
                                    popper: classes.userOptionsContainer,
                                    listbox: classes.userOptionsDrawer,
                                    option: classes.userOptions,
                                    endAdornment:
                                        classes.userSelectInputEndAdornment,
                                    inputRoot: classes.userSearchInputField,
                                    tag: classes.userShareSelectedTag,
                                    input: classes.userSearchInputWidth,
                                }}
                                onClose={handleUserSelectClose}
                                onChange={handleUserSelect}
                                openOnFocus
                                options={users}
                                getOptionLabel={(option) =>
                                    `${option.firstName} ${option.lastName}`
                                }
                                renderOption={getOptions}
                                filterSelectedOptions
                                renderInput={(params) =>
                                    renderUserSelectInput(params)
                                }
                                filterOptions={filterUserOptions}
                                getOptionSelected={getUsersSelected}
                                loading={loadingUsers}
                            />
                        </div>

                        <CustomButton
                            name={injectIntlTranslation(intl, "SendInvite")}
                            disabled={!usersSelectedForShare.length || modifyRoleLoadingIndex}
                            id="send-invite"
                            variant="contained"
                            color="primary"
                            onClick={handleShareProjectClick}
                            className={!usersSelectedForShare.length ? classes.sendInviteButton : classes.sendInviteButtonActive}
                            showGradient={true}
                        />
                    </div>
                    <div className={classes.sharedWithListForDialogContainer}>
                        {renderSharedWith()}
                    </div>
                </div>
            </div>
        </ConfirmModal>
    );
};

const mapStateToProps = (state) => {
    return {
        appName: state.userProfile.apps[0].appName,
    };
}

export default injectIntl(connect(mapStateToProps, { showLoader, hideLoader, showSuccessNotification,
    showErrorNotification, refreshProjectList })(ProjectShareDialog));
