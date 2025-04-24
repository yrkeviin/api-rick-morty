"use client";

import styles from "../home/Home.module.css"
import { useEffect, useState } from "react";
import CharacterCard from "../../components/CharacterCard";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
    const [search, setSearch] = useState("");
    const [characters, setCharacters] = useState([]);
    const [notFound, setNotFound] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchCharacters = async (name, pageNumber) => {
        try {
            const { data } = await axios.get(`https://rickandmortyapi.com/api/character/?page=${pageNumber}&name=${name}`);
            setCharacters(data.results);
            setTotalPages(data.info.pages);
            setNotFound(false);
        } catch {
            setCharacters([]);
            setNotFound(true);
        }
    };
    useEffect(() => {
        fetchCharacters(search.trim(), page);
    }, [page]);

    useEffect(() => {
        fetchCharacters(search, page);
    }, [search]);

    const handleSearch = () =>{
        const name = search.trim();
        setPage(1);
        fetchCharacters(name, 1);
    };

    const handleReset = () => {
        setSearch("");
        setPage(1);
        fetchCharacters("", 1);
        toast.success("filtro foi resetado", {position: "top-left"});
    }   

    const handleCardClick = (name) => {
        toast.info(`Você clicou em ${name}`, {
        });
    }

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

                <button 
                onClick={() => {
                setSearch("");
                fetchCharacters();
                }}
                className={styles.buttonReset}>
                    🗑
                </button>
            </div>

            <div className={styles.buttonPageNav}>
                <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className={styles.buttonNav}
                >
                    Página anterior
                </button>

                <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className={styles.buttonNav}
                >
                    Próxima página
                </button>
                    
                {notFound && (
                <h1 className={styles.notFound}>Personagem não encontrado!</h1>
                )}

            </div>

<div className={styles.grid}>
    {characters.map((char) => (
        <CharacterCard
            key={char.id}
            character={char}
            onClick={() => handleCardClick(char.name)}
        />
    ))}
</div>
        </div>
    )
}