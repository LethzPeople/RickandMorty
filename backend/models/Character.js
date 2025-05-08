import mongoose from 'mongoose';

const characterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Alive', 'Dead', 'unknown'],
      default: 'Alive',
    },
    species: {
      type: String,
      required: [true, 'La especie es obligatoria'],
    },
    type: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Genderless', 'unknown'],
      default: 'unknown',
    },
    origin: {
      name: {
        type: String,
        default: 'unknown',
      },
      url: {
        type: String,
        default: '',
      },
    },
    location: {
      name: {
        type: String,
        default: 'unknown',
      },
      url: {
        type: String,
        default: '',
      },
    },
    image: {
      type: String,
      default: 'https://rickandmortyapi.com/api/character/avatar/19.jpeg',
    },
    created: {
      type: Date,
      default: Date.now,
    },
    apiId: {
      type: Number,
      default: null,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    isCustom: {
      type: Boolean,
      default: true,
    },
    ageRestriction: {
      type: String,
      enum: ['all', 'adult'],
      default: 'all',
    },
  },
  {
    timestamps: true,
  }
);

const Character = mongoose.model('Character', characterSchema);

export default Character;