import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del perfil es obligatorio'],
      trim: true,
    },
    avatar: {
      type: String,
      default: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    age: {
      type: Number,
      default: 18, // Edad por defecto: adulto
    },
    type: {
      type: String,
      enum: ['adult', 'child'],
      default: 'adult',
    },
    favorites: [
      {
        type: mongoose.Schema.Types.Mixed
      }
    ],
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;