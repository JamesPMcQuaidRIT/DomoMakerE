const handleDomo = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width: 'hide'}, 350);
    
    if($("#domoName").val() == '' || $("#domoAge").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }
        
    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function(){
        loadDomosFromServer();
    });
    
    return false;
};

const handleAgeUp = (e) => {
    e.preventDefault();
    
    sendAjax('POST', $("#ageForm").attr("action"), $("#ageForm").serialize(), function(){
        loadDomosFromServer();
    });
}

const DomoForm = (props) => {
    return (
    <form id="domoForm" 
        onSubmit={handleDomo}
        name="domoForm"
        action="/maker"
        method="POST"
        className="domoForm"
    >
    <label htmlFor="name">Name: </label>
    <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
    <label htmlFor="age">Age: </label>
    <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
    <select id="domoClass" name="class">
         <option value="Barbarian">Barbarian</option>
         <option value="Monk">Monk</option>  
        <option value="Paladin">Paladin</option>  
        <option value="Rogue">Rogue</option>  
        <option value="Wizard">Wizard</option>  
    </select>
    <input type="hidden" name="_csrf" value={props.csrf}/>
    <input className="makeDomoSubmit" type="submit" value="Make Domo" />
    </form>
    );
};

const DomoList = function(props) {
    if(props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet</h3>
            </div>
        );
    }
    
    const domoNodes = props.domos.map(function(domo) {
        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
                <h3 className="domoClass">Class: {domo.class}</h3>
                <form id="ageForm" 
                    onSubmit={handleAgeUp}
                    name="ageForm"
                    action="/age"
                    method="POST"
                    className="ageForm"
                >
                    <input id="domoNameCheck" type="text" name="nameCheck" value=`${domo.age}` placeholder="Domo Name"/>
                    <input className="ageButton" type="submit" value="Age Up"/>
                </form>
            </div>
        );
    });
    
    return (
    <div className="domoList">
        {domoNodes}
    </div>
    );
};

const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <DomoList domos={data.domo} />, document.querySelector("#domos")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
    );
    
    ReactDOM.render(
        <DomoList domos={[]} />, document.querySelector("#domos")
    );
    
    loadDomosFromServer();    
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});