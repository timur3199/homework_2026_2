'use strict';

/**
 * Загружает данные по списку ссылок и объединяет их в один объект.
 * Для каждого ключа результат - массив уникальных значений,
 * встретившихся в загруженных объектах. Ошибки отдельных
 * запросов игнорируются, такие ссылки просто пропускаются
 *
 * @async
 * @param {Array<string>} urls список адресов для загрузки
 * @throws {TypeError} если urls не являнтся массивом
 * @returns {Promise<Object>} объект с объединенными данными
 * 
 * @example
 * // returns { id: [1, 2], name: ['Олег', 'Мария'] }
 * fetchAndMergeData(['url1', 'url2']);
 */
async function fetchAndMergeData(urls) {
    if (!Array.isArray(urls)) {
        throw new TypeError('urls must be an array');
    }

    const result = {};

    const settled = await Promise.allSettled(
        urls.map((url) => 
            fetch(url).then((response) => {
                if (!response.ok) {
                    throw new Error(`Request failed: ${url}`);
                }
                return response.json();
            })
        )
    );
            
    for (const item of settled) {
        if (item.status !== 'fulfilled') {
            continue;
        }
        const data = item.value;
        for (const [key, value] of Object.entries(data)) {
            if (!result[key]) {
                result[key] = [];
            }
            if (!result[key].includes(value)) {
                result[key].push(value);
            }
        }
    }
    return result;
}
