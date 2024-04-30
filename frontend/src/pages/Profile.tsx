export function Profile(){

    return(
        <div className="profile">
            <div className="profile-header">
            <img src="https://static.vecteezy.com/system/resources/previews/005/129/844/original/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg" width="200px"/>
            <div className="email">
        <div className="description-overview">
                <button
                  className="edit-name-btn"
                >
                  Change name
                </button>
              </div>
       
        <button className="signout-btn"
            >
              Sign out
            </button>
        </div>
        </div>
        </div>
    )
}