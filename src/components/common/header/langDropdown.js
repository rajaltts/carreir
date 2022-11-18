import React, { useEffect, useState, useRef } from "react";
import { LangOpt } from "../../../utilities/languagesutils";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { showErrorNotification } from "@carrier/workflowui-globalfunctions";

const LangDropdown = (props) => {
  const { selectedItem, onChange, fullLangCode } = props;
  const node = useRef();

  const [open, setOpen] = useState(false);

  const handleClick = (e) => {
    if (node.current.contains(e.target)) {
      return;
    }
    setOpen(false);
  };

  const handleChange = (selectedObj) => {
    setOpen(false);
    if (
      (props.history.location.pathname === "/Naapp" ||
        props.history.location.pathname === "/NAConfiguration") &&
      selectedObj.lang !== "en"
    ) {
      props.showErrorNotification("The selected language is not supported for this Product line. Language defaulted to English.");
      onChange(selectedObj);
    } else {
      onChange(selectedObj);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  useEffect(() => {
    setLang(fullLangCode);
  }, [fullLangCode]);

  function setLang(lang) {
    window.zE('webWidget', 'setLocale', lang);
  }

  return (
		<li ref={node} class='dropdown-lang-wrapper'>
			<span
				role='button'
				className='dropdown-toggler'
				onClick={(e) => setOpen(!open)}
			>
				<img src={selectedItem.img} alt={selectedItem.name} />
				{selectedItem.name}
				<span className='caret' />
			</span>
			{open && (
				<ul className='dropdown-lang dropdown-menu'>
					{LangOpt.map((opt, idx) => (
						<li
							className={
								opt.name === selectedItem.name
									? 'active'
									: ''
							}
							key={idx}
							onClick={(e) => handleChange(opt)}
						>
							<img src={opt.img} alt='' /> {opt.name}
						</li>
					))}
				</ul>
			)}
		</li>
  );
};
const mapStateToProps = (state) => ({
  fullLangCode: state.locale.fullLangCode,
})

export default withRouter(connect(mapStateToProps, { showErrorNotification })(React.memo(LangDropdown)));

