"use client";

import styles from "../home/Home.module.css"
import { useEffect, useState, useRef } from "react";
import CharacterCard from "../../components/CharacterCard";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../components/Loader";

export default function Home() {
    const [search, setSearch] = useState(""); // Estado para o texto da pesquisa
    const [page, setPage] = useState(1); // Estado para a página atual
    const [totalPages, setTotalPages] = useState(1); // Estado para o total de páginas
    const [characters, setCharacters] = useState([]);
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(true);
    const cacheRef = useRef(new Map());

    const fetchCharacters = async (name = "", pageNumber = 1) => {
        setLoading(true);
        const cache = cacheRef.current;
        const cacheKey = `${name}_${pageNumber}`;
        const nextPageNumber = pageNumber + 1;
        const nextCacheKey = `${name}_${nextPageNumber}`;

        const cleanCacheIfNeeded = () => {
            while (cache.size >= 5) {
                const firstKey = cache.keys().next().value;
                cache.delete(firstKey);
                console.log(` Removido do cache: ${firstKey} 🗑`);
            }
        };

        console.log("\n============== inicio da busca ==============");
        console.log(` Cache anterior: ${cache.size} páginas`);

        let total = totalPages;

        if (cache.has(cacheKey)) {
            const cached = cache.get(cacheKey);
            setCharacters(cached.results);
            setTotalPages(cached.totalPages);
            total = cached.totalPages;
            setNotFound(false);
            setLoading(false);
            console.log(`Usando cache: ${cacheKey}`);
        } else {
            try {
                const { data } = await axios.get(
                    `https://rickandmortyapi.com/api/character/?page=${pageNumber}&name=${name}`
                );

                cleanCacheIfNeeded();
                cache.set(cacheKey, {
                    results: data.results,
                    totalPages: data.info.pages,
                });

                setCharacters(data.results);
                setTotalPages(data.info.pages);
                total = data.info.pages;
                setNotFound(false);
                console.log(` Salvo no cache: ${cacheKey}`);
            } catch {
                setCharacters([]);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        }
        if (nextPageNumber <= total && !cache.has(nextCacheKey)) {
            try {
                const res = await axios.get(
                    `https://rickandmortyapi.com/api/character/?page=${nextPageNumber}&name=${name}`
                );
                cleanCacheIfNeeded();
                cache.set(nextCacheKey, {
                    results: res.data.results,
                    totalPages: res.data.info.pages,
                });
                console.log(` Prefetch salvo: ${nextCacheKey}`);
            } catch (err) {
                console.log(`Prefetch falhou: ${nextCacheKey}`, err);
            }
        } else {
            console.log("Prefetch ignorado: já no cache ou fora do limite");
        }

        console.log(` Cache final: ${cache.size} páginas`);
        for (const [key, val] of cache.entries()) {
            console.log(` ${key}: ${val.results.length} personagens`);
        }
        console.log("============== busca finalizada ==============\n");
    };

    useEffect(() => {
        fetchCharacters(search, page);
    }, [page]);

    return (
        <div className={styles.container}>
            <ToastContainer
                position="top-right"
                autoClose={7500}
                theme="light"
            />

            <h1 className={styles.title}>Rick and Morty</h1>

            <div className={styles.input}>
                <input
                    type="text"
                    placeholder="Pesquise seu personagem!"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <button
                    onClick={() => fetchCharacters(search)}
                    className={styles.buttonSearch}
                >
                    🔎
                </button>

                <button
                    onClick={() => {
                        setSearch("");
                        fetchCharacters();
                    }}
                    className={styles.buttonReset}
                >
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

                <span className={styles.pageIndicator}>
                    Página {page} de {totalPages}
                </span>

                <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className={styles.buttonNav}
                >
                    Próxima página
                </button>
            </div>

            {notFound && (
                <h1 className={styles.notFound}>Personagem não encontrado!!</h1>
            )}

            {loading ? (
                <div
                    className={`${styles.loaderWrapper} ${
                        loading ? "" : styles.hidden
                    }`}
                >
                    <Loader />
                </div>
            ) : (
                <div className={styles.grid}>
                    {characters.map((char) => (
                        <CharacterCard
                            key={char.id}
                            character={char}
                            onClick={() => handleCardClick(char)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}