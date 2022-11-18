import React from "react";
import AvatarSingle from "../../../common/controls/avatars/AvatarSingle";
import AvatarStacked from "../../../common/controls/avatars/AvatarStacked";

const SharedListAvatars = (props) => {
    const { sharedWithInitialTexts } = props;
    const maxAvatarsTogether = 4;

    const renderAvatars = () => {
        return sharedWithInitialTexts.map((text, index) => (
            <AvatarSingle key={text+index} avatarText={text} />
        ));
    };

    return <AvatarStacked max={maxAvatarsTogether}>{renderAvatars()}</AvatarStacked>;
};

export default SharedListAvatars;
