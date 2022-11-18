export const getSharePermission = (permissions) => {
    if (!!permissions.length) {
        let hasPermission = false;
        permissions.forEach((permission) => {
            if (permission.settingName === "Platform Permissions") {
                !!permission.childSettings && permission.childSettings.forEach((item) => {
                    if (item.settingName === "Share Project") {
                        hasPermission = true;
                    }
                })
            }
        })
        return hasPermission;
    }
    return false;
}