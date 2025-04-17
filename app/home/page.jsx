"use client";

import { useEffect, useState } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import CharacterCard from '../../components/CharacterCard';

import styles from "./Home.module.css"

export default function Home() {
    const [search, setSearch] = useState('');
    const [notFound, setNotFound] = useState(false);
    const [characters, setCharacters] = useState([]);

    const fetchCharacters = async (name = "") => {
        setNotFound(false);
        try {
            const { data } = await axios.get(`https://rickandmortyapi.com/api/character/?name=${name}`);
            setCharacters(data.results);
        } catch (error) {
            setCharacters([]);
            setNotFound(true);
        }
    };

    useEffect(() => {
        fetchCharacters();
    }, []);

    const handleCardClick = (name) => {
        toast.info(`Você clicou no personagem: ${name}`, {
        });
    }

    console.log(characters);

    return (
        <div className={styles.container}>
            <ToastContainer
                position="top-right"
                autoClose={7500}
                theme='light'
            />

            <h1 className={styles.title}>Rick and Morty</h1>

            <div className={styles.input}>
                <input type="text" placeholder='Pesquise seu personagem!' value={search} onChange={(e) => setSearch(e.target.value)} />

                <button
                onClick={() => fetchCharacters(search)}
                className={styles.buttonSearch}>
                    🔎
                </button>

                <button onClick={() => {
                    setSearch("");
                    fetchCharacters();
                }}
                className={styles.buttonReset}>
                    🗑
                </button>
            </div>
            {notFound && (
                <h1 className={styles.notFound}>Personagem não encontrado!</h1>
            )}

            <div className={styles.grid}>
            {characters.map((char) => (
                <CharacterCard key={char.id} character={char} onClick={() => handleCardClick (char.nome)} />
            ))}
            </div>
        </div>
    )
}