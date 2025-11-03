import { RandomUser } from "../types/RandomUser"

export const RandomUserCard: React.FC<{ user: RandomUser }> = ({ user }) => {
    return <div className="user-card">
        <img src={user.picture.large} alt={`${user.name.first} ${user.name.last}`} />
        <h3>{user.name.first} {user.name.last}</h3>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phone}</p>
        <p>Cell: {user.cell}</p>
        <p>Location: {user.location.city}, {user.location.country}</p>
        <p>Address: {user.location.street.number} {user.location.street.name}</p>
        <p>Birthday: {new Date(user.dob.date).toLocaleDateString()}</p>
        <p>Age: {user.dob.age}</p>
        <p>Gender: {user.gender}</p>
        <a href={`https://www.google.com/maps?q=${user.location.coordinates.latitude},${user.location.coordinates.longitude}`} target="_blank" rel="noopener noreferrer">View on Google Maps</a>
    </div>
}
