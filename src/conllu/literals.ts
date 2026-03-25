// https://universaldependencies.org/u/pos/index.html
export const uposs = [
	"ADJ",
	"ADP",
	"ADV",
	"AUX",
	"CCONJ",
	"DET",
	"INTJ",
	"NOUN",
	"NUM",
	"PART",
	"PRON",
	"PROPN",
	"PUNCT",
	"SCONJ",
	"SYM",
	"VERB",
	"X",
] as const;
export type Upos = (typeof uposs)[number];

export const deprels = [
	/** Abaza, Abkhaz, Akkadian, Albanian, Alemannic, Amharic, Ancient Greek, Ancient Hebrew, Apurina, Arabic, Armenian, Assyrian, Azerbaijani, Bambara, Basque, Bavarian, Beja, Belarusian, Bengali, Bhojpuri, Bokota, Bororo, Breton, Bulgarian, Buryat, Cantonese, Cappadocian, Catalan, Cebuano, Chinese, Chukchi, Classical Armenian, Classical Chinese, Coptic, Croatian, Czech, Danish, Dutch, Egyptian, English, Erzya, Esperanto, Estonian, Faroese, Finnish, French, Frisian Dutch, Galician, Georgian, German, Gheg, Gothic, Greek, Gujarati, Gwichin, Haitian Creole, Hausa, Hebrew, Highland Puebla Nahuatl, Hindi, Hittite, Hungarian, Icelandic, Ika, Indonesian, Irish, Italian, Japanese, Javanese, Karelian, Karo, Kazakh, Khoekhoe, Kiche, Komi Permyak, Komi Zyrian, Korean, Kurmanji, Kyrgyz, Latgalian, Latin, Latvian, Ligurian, Lithuanian, Livvi, Low Saxon, Luxembourgish, Macedonian, Maghrebi Arabic French, Malayalam, Maltese, Manx, Marathi, Mbya Guarani, Middle French, Moksha, Munduruku, Naga, Naija, Neapolitan, Nheengatu, North Sami, Northwest Gbaya, Norwegian, Occitan, Odia, Old Church Slavonic, Old East Slavic, Old English, Old French, Old Irish, Ottoman Turkish, Pashto, Paumari, Persian, Pesh, Phrygian, Polish, Pomak, Portuguese, Romanian, Russian, Sanskrit, Scottish Gaelic, Serbian, Sindhi, Sinhala, Skolt Sami, Slovak, Slovenian, South Levantine Arabic, Spanish, Spanish Sign Language, Swedish, Swedish Sign Language, Tagalog, Tamil, Tatar, Teko, Telugu, Telugu English, Thai, Tupinamba, Turkish, Turkish English, Turkish German, Ukrainian, Umbrian, Upper Sorbian, Urdu, Uyghur, Uzbek, Veps, Vietnamese, Warlpiri, Welsh, Western Armenian, Western Sierra Puebla Nahuatl, Wolof, Xavante, Xibe, Yoruba, Yupik, Zaar */
	"acl",
	/** Abaza, Abkhaz, Akkadian, Akuntsu, Albanian, Alemannic, Amharic, Ancient Greek, Ancient Hebrew, Apurina, Arabic, Armenian, Assyrian, Azerbaijani, Bambara, Basque, Bavarian, Beja, Belarusian, Bengali, Bhojpuri, Bokota, Bororo, Breton, Bulgarian, Buryat, Cantonese, Cappadocian, Catalan, Cebuano, Chinese, Chukchi, Classical Armenian, Classical Chinese, Coptic, Croatian, Czech, Danish, Dutch, Egyptian, English, Erzya, Esperanto, Estonian, Faroese, Finnish, French, Frisian Dutch, Galician, Georgian, German, Gheg, Gothic, Greek, Guajajara, Guarani, Gujarati, Gwichin, Haitian Creole, Hausa, Hebrew, Highland Puebla Nahuatl, Hindi, Hittite, Hungarian, Icelandic, Ika, Indonesian, Irish, Italian, Japanese, Javanese, Kaapor, Kangri, Karelian, Karo, Kazakh, Khoekhoe, Khunsari, Kiche, Komi Permyak, Komi Zyrian, Korean, Kurmanji, Kyrgyz, Latgalian, Latin, Latvian, Ligurian, Lithuanian, Livvi, Low Saxon, Luxembourgish, Macedonian, Madi, Maghrebi Arabic French, Makurap, Malayalam, Maltese, Manx, Marathi, Mbya Guarani, Middle French, Moksha, Munduruku, Naga, Naija, Nayini, Neapolitan, Nheengatu, North Sami, Northwest Gbaya, Norwegian, Occitan, Odia, Old Church Slavonic, Old East Slavic, Old English, Old French, Old Irish, Old Turkish, Ottoman Turkish, Pashto, Paumari, Persian, Pesh, Phrygian, Polish, Pomak, Portuguese, Romanian, Russian, Sanskrit, Scottish Gaelic, Serbian, Sindhi, Sinhala, Skolt Sami, Slovak, Slovenian, Soi, South Levantine Arabic, Spanish, Spanish Sign Language, Swedish, Swedish Sign Language, Tagalog, Tamil, Tatar, Teko, Telugu, Telugu English, Thai, Tswana, Tupinamba, Turkish, Turkish English, Turkish German, Ukrainian, Umbrian, Upper Sorbian, Urdu, Uyghur, Uzbek, Veps, Vietnamese, Warlpiri, Welsh, Western Armenian, Western Sierra Puebla Nahuatl, Wolof, Xavante, Xibe, Yoruba, Yupik, Zaar */
	"advcl",
	/** Abaza, Abkhaz, Afrikaans, Akkadian, Akuntsu, Albanian, Alemannic, Amharic, Ancient Greek, Ancient Hebrew, Apurina, Arabic, Armenian, Assyrian, Azerbaijani, Bambara, Basque, Bavarian, Beja, Belarusian, Bengali, Bhojpuri, Bokota, Bororo, Breton, Bulgarian, Buryat, Cantonese, Cappadocian, Catalan, Cebuano, Chinese, Chukchi, Classical Armenian, Classical Chinese, Coptic, Croatian, Czech, Danish, Dutch, Egyptian, English, Erzya, Esperanto, Estonian, Faroese, Finnish, French, Frisian Dutch, Galician, Georgian, German, Gheg, Gothic, Greek, Guajajara, Guarani, Gujarati, Gwichin, Haitian Creole, Hausa, Hebrew, Highland Puebla Nahuatl, Hindi, Hittite, Hungarian, Icelandic, Ika, Indonesian, Irish, Italian, Japanese, Javanese, Kaapor, Kangri, Karelian, Karo, Kazakh, Khoekhoe, Khunsari, Kiche, Komi Permyak, Komi Zyrian, Korean, Kurmanji, Kyrgyz, Latgalian, Latin, Latvian, Ligurian, Lithuanian, Livvi, Low Saxon, Luxembourgish, Macedonian, Madi, Maghrebi Arabic French, Makurap, Malayalam, Maltese, Manx, Marathi, Mbya Guarani, Middle French, Moksha, Munduruku, Naga, Naija, Nayini, Neapolitan, Nenets, Nheengatu, North Sami, Northwest Gbaya, Norwegian, Occitan, Odia, Old Church Slavonic, Old East Slavic, Old English, Old French, Old Irish, Old Turkish, Ottoman Turkish, Pashto, Paumari, Persian, Pesh, Phrygian, Polish, Pomak, Portuguese, Romanian, Russian, Sanskrit, Scottish Gaelic, Serbian, Sindhi, Sinhala, Skolt Sami, Slovak, Slovenian, Soi, South Levantine Arabic, Spanish, Spanish Sign Language, Swedish, Swedish Sign Language, Tagalog, Tamil, Tatar, Teko, Telugu, Telugu English, Thai, Tswana, Tupinamba, Turkish, Turkish English, Turkish German, Ukrainian, Umbrian, Upper Sorbian, Urdu, Uyghur, Uzbek, Veps, Vietnamese, Warlpiri, Welsh, Western Armenian, Western Sierra Puebla Nahuatl, Wolof, Xavante, Xibe, Yakut, Yoruba, Yupik, Zaar */
	"advmod",
	/** Abaza, Abkhaz, Afrikaans, Akkadian, Akuntsu, Albanian, Alemannic, Amharic, Ancient Greek, Ancient Hebrew, Arabic, Armenian, Assyrian, Azerbaijani, Bambara, Basque, Bavarian, Beja, Belarusian, Bengali, Bhojpuri, Bokota, Breton, Bulgarian, Buryat, Cantonese, Cappadocian, Catalan, Cebuano, Chinese, Chukchi, Classical Armenian, Classical Chinese, Coptic, Croatian, Czech, Danish, Dutch, Egyptian, English, Erzya, Esperanto, Estonian, Faroese, Finnish, French, Frisian Dutch, Galician, Georgian, German, Gheg, Gothic, Greek, Gujarati, Gwichin, Haitian Creole, Hausa, Hebrew, Highland Puebla Nahuatl, Hindi, Hittite, Icelandic, Ika, Indonesian, Irish, Italian, Japanese, Javanese, Kaapor, Kangri, Karelian, Karo, Kazakh, Khoekhoe, Khunsari, Kiche, Komi Permyak, Komi Zyrian, Korean, Kurmanji, Kyrgyz, Latgalian, Latin, Latvian, Ligurian, Lithuanian, Livvi, Low Saxon, Luxembourgish, Macedonian, Madi, Maghrebi Arabic French, Malayalam, Maltese, Manx, Marathi, Mbya Guarani, Middle French, Moksha, Munduruku, Naga, Naija, Nayini, Neapolitan, Nenets, Nheengatu, North Sami, Northwest Gbaya, Norwegian, Occitan, Odia, Old Church Slavonic, Old East Slavic, Old English, Old French, Old Irish, Old Turkish, Ottoman Turkish, Pashto, Paumari, Persian, Phrygian, Polish, Pomak, Portuguese, Romanian, Russian, Sanskrit, Scottish Gaelic, Serbian, Sindhi, Sinhala, Skolt Sami, Slovak, Slovenian, South Levantine Arabic, Spanish, Spanish Sign Language, Swedish, Swedish Sign Language, Tagalog, Tamil, Tatar, Teko, Telugu, Telugu English, Thai, Tswana, Tupinamba, Turkish, Turkish English, Turkish German, Ukrainian, Umbrian, Upper Sorbian, Urdu, Uyghur, Uzbek, Veps, Vietnamese, Warlpiri, Welsh, Western Armenian, Western Sierra Puebla Nahuatl, Wolof, Xavante, Xibe, Yakut, Yoruba, Zaar */
	"amod",
	/** Abkhaz, Afrikaans, Akkadian, Akuntsu, Albanian, Alemannic, Ancient Greek, Ancient Hebrew, Apurina, Arabic, Armenian, Azerbaijani, Bambara, Basque, Bavarian, Beja, Belarusian, Bhojpuri, Breton, Bulgarian, Buryat, Cantonese, Cappadocian, Catalan, Cebuano, Chinese, Chukchi, Classical Armenian, Classical Chinese, Coptic, Croatian, Czech, Danish, Dutch, Egyptian, English, Erzya, Esperanto, Estonian, Faroese, Finnish, French, Frisian Dutch, Galician, Georgian, German, Gheg, Gothic, Greek, Guajajara, Guarani, Gujarati, Gwichin, Haitian Creole, Hausa, Hebrew, Highland Puebla Nahuatl, Hindi, Hittite, Hungarian, Icelandic, Ika, Indonesian, Irish, Italian, Japanese, Javanese, Karelian, Karo, Kazakh, Khoekhoe, Kiche, Komi Permyak, Komi Zyrian, Korean, Kurmanji, Kyrgyz, Latgalian, Latin, Latvian, Ligurian, Lithuanian, Livvi, Low Saxon, Luxembourgish, Macedonian, Maghrebi Arabic French, Malayalam, Maltese, Manx, Marathi, Mbya Guarani, Middle French, Moksha, Munduruku, Naga, Naija, Neapolitan, Nheengatu, North Sami, Northwest Gbaya, Norwegian, Occitan, Odia, Old Church Slavonic, Old East Slavic, Old English, Old French, Ottoman Turkish, Pashto, Persian, Pesh, Phrygian, Polish, Pomak, Portuguese, Romanian, Russian, Sanskrit, Scottish Gaelic, Serbian, Sindhi, Skolt Sami, Slovak, Slovenian, Spanish, Spanish Sign Language, Swedish, Swedish Sign Language, Tatar, Teko, Telugu, Thai, Tswana, Tupinamba, Turkish, Turkish German, Ukrainian, Umbrian, Upper Sorbian, Uyghur, Uzbek, Veps, Vietnamese, Welsh, Western Armenian, Western Sierra Puebla Nahuatl, Wolof, Xibe, Yakut, Yoruba, Yupik, Zaar */
	"appos",
	/** Abkhaz, Afrikaans, Akuntsu, Albanian, Alemannic, Amharic, Ancient Greek, Apurina, Arabic, Armenian, Assyrian, Azerbaijani, Bambara, Basque, Bavarian, Beja, Belarusian, Bengali, Bhojpuri, Bokota, Breton, Bulgarian, Buryat, Cantonese, Cappadocian, Catalan, Chinese, Chukchi, Classical Armenian, Classical Chinese, Coptic, Croatian, Czech, Danish, Dutch, Egyptian, English, Erzya, Esperanto, Estonian, Faroese, Finnish, French, Frisian Dutch, Galician, Georgian, German, Gheg, Greek, Guajajara, Gujarati, Haitian Creole, Hausa, Hebrew, Highland Puebla Nahuatl, Hindi, Hittite, Hungarian, Icelandic, Ika, Indonesian, Irish, Italian, Japanese, Javanese, Kaapor, Kangri, Karelian, Karo, Kazakh, Khoekhoe, Khunsari, Kiche, Komi Permyak, Komi Zyrian, Korean, Kurmanji, Kyrgyz, Latin, Latvian, Ligurian, Lithuanian, Livvi, Low Saxon, Luxembourgish, Macedonian, Madi, Maghrebi Arabic French, Makurap, Malayalam, Maltese, Marathi, Mbya Guarani, Middle French, Moksha, Munduruku, Naga, Naija, Nayini, Neapolitan, Nenets, Nheengatu, North Sami, Norwegian, Occitan, Odia, Old Church Slavonic, Old East Slavic, Old English, Old French, Old Turkish, Ottoman Turkish, Pashto, Paumari, Persian, Pesh, Phrygian, Polish, Pomak, Portuguese, Romanian, Russian, Sanskrit, Serbian, Sindhi, Sinhala, Skolt Sami, Slovak, Slovenian, Soi, South Levantine Arabic, Spanish, Spanish Sign Language, Swedish, Swedish Sign Language, Tagalog, Tamil, Tatar, Thai, Tswana, Turkish, Turkish English, Turkish German, Ukrainian, Umbrian, Upper Sorbian, Urdu, Uyghur, Uzbek, Veps, Vietnamese, Warlpiri, Welsh, Western Armenian, Western Sierra Puebla Nahuatl, Wolof, Xavante, Xibe, Yakut, Yoruba, Zaar */
	"aux",
	/** Abaza, Abkhaz, Afrikaans, Akkadian, Akuntsu, Albanian, Alemannic, Amharic, Ancient Greek, Ancient Hebrew, Apurina, Arabic, Armenian, Assyrian, Azerbaijani, Bambara, Basque, Bavarian, Belarusian, Bengali, Bhojpuri, Bokota, Bororo, Breton, Bulgarian, Buryat, Cantonese, Cappadocian, Catalan, Cebuano, Chinese, Chukchi, Classical Armenian, Classical Chinese, Coptic, Croatian, Czech, Danish, Dutch, Egyptian, English, Erzya, Esperanto, Estonian, Faroese, Finnish, French, Frisian Dutch, Galician, Georgian, German, Gheg, Gothic, Greek, Guajajara, Guarani, Gujarati, Gwichin, Haitian Creole, Hausa, Hebrew, Highland Puebla Nahuatl, Hindi, Hittite, Hungarian, Icelandic, Ika, Indonesian, Irish, Italian, Japanese, Javanese, Kaapor, Kangri, Karelian, Karo, Kazakh, Khoekhoe, Khunsari, Kiche, Komi Permyak, Komi Zyrian, Korean, Kurmanji, Kyrgyz, Latgalian, Latin, Latvian, Ligurian, Lithuanian, Livvi, Low Saxon, Luxembourgish, Macedonian, Maghrebi Arabic French, Makurap, Malayalam, Maltese, Manx, Marathi, Mbya Guarani, Middle French, Moksha, Munduruku, Naga, Naija, Nayini, Neapolitan, Nenets, Nheengatu, North Sami, Northwest Gbaya, Norwegian, Occitan, Odia, Old Church Slavonic, Old East Slavic, Old English, Old French, Old Irish, Old Turkish, Ottoman Turkish, Pashto, Paumari, Persian, Pesh, Phrygian, Polish, Pomak, Portuguese, Romanian, Russian, Sanskrit, Scottish Gaelic, Serbian, Sindhi, Sinhala, Skolt Sami, Slovak, Slovenian, Soi, South Levantine Arabic, Spanish, Spanish Sign Language, Swedish, Swedish Sign Language, Tagalog, Tamil, Tatar, Teko, Telugu, Telugu English, Thai, Tswana, Tupinamba, Turkish, Turkish English, Turkish German, Ukrainian, Umbrian, Upper Sorbian, Urdu, Uyghur, Uzbek, Veps, Vietnamese, Warlpiri, Welsh, Western Armenian, Western Sierra Puebla Nahuatl, Wolof, Xavante, Xibe, Yakut, Yoruba, Zaar */
	"case",
	/** Abaza, Abkhaz, Afrikaans, Akkadian, Albanian, Alemannic, Amharic, Ancient Greek, Ancient Hebrew, Apurina, Arabic, Armenian, Assyrian, Azerbaijani, Bambara, Basque, Bavarian, Beja, Belarusian, Bhojpuri, Bokota, Bororo, Breton, Bulgarian, Buryat, Cantonese, Cappadocian, Catalan, Cebuano, Chinese, Chukchi, Classical Armenian, Classical Chinese, Coptic, Croatian, Czech, Danish, Dutch, Egyptian, English, Erzya, Esperanto, Estonian, Faroese, Finnish, French, Frisian Dutch, Galician, Georgian, German, Gheg, Gothic, Greek, Guajajara, Gujarati, Gwichin, Haitian Creole, Hausa, Hebrew, Highland Puebla Nahuatl, Hindi, Hittite, Hungarian, Icelandic, Ika, Indonesian, Irish, Italian, Japanese, Javanese, Kaapor, Kangri, Karelian, Kazakh, Khoekhoe, Khunsari, Kiche, Komi Permyak, Komi Zyrian, Korean, Kurmanji, Kyrgyz, Latgalian, Latin, Latvian, Ligurian, Lithuanian, Livvi, Low Saxon, Luxembourgish, Macedonian, Maghrebi Arabic French, Makurap, Malayalam, Maltese, Manx, Marathi, Mbya Guarani, Middle French, Moksha, Munduruku, Naga, Naija, Nayini, Neapolitan, Nheengatu, North Sami, Northwest Gbaya, Norwegian, Occitan, Odia, Old Church Slavonic, Old East Slavic, Old English, Old French, Old Irish, Old Turkish, Ottoman Turkish, Pashto, Persian, Pesh, Phrygian, Polish, Pomak, Portuguese, Romanian, Russian, Sanskrit, Scottish Gaelic, Serbian, Sindhi, Sinhala, Skolt Sami, Slovak, Slovenian, South Levantine Arabic, Spanish, Spanish Sign Language, Swedish, Swedish Sign Language, Tagalog, Tamil, Tatar, Teko, Telugu, Thai, Tswana, Tupinamba, Turkish, Turkish English, Turkish German, Ukrainian, Umbrian, Upper Sorbian, Urdu, Uyghur, Uzbek, Veps, Vietnamese, Welsh, Western Armenian, Western Sierra Puebla Nahuatl, Wolof, Xibe, Yakut, Yoruba, Yupik, Zaar */
	"cc",
	/** Abaza, Afrikaans, Akkadian, Akuntsu, Albanian, Alemannic, Amharic, Ancient Greek, Ancient Hebrew, Apurina, Arabic, Armenian, Assyrian, Azerbaijani, Bambara, Basque, Bavarian, Beja, Belarusian, Bengali, Bhojpuri, Bokota, Bororo, Breton, Bulgarian, Buryat, Cantonese, Cappadocian, Catalan, Cebuano, Chinese, Chukchi, Classical Armenian, Classical Chinese, Coptic, Croatian, Czech, Danish, Dutch, Egyptian, English, Erzya, Esperanto, Estonian, Faroese, Finnish, French, Frisian Dutch, Galician, Georgian, German, Gheg, Gothic, Greek, Guajajara, Gujarati, Gwichin, Haitian Creole, Hausa, Hebrew, Highland Puebla Nahuatl, Hindi, Hittite, Hungarian, Icelandic, Ika, Indonesian, Irish, Italian, Japanese, Javanese, Kaapor, Kangri, Karelian, Karo, Kazakh, Khoekhoe, Khunsari, Kiche, Komi Permyak, Komi Zyrian, Korean, Kurmanji, Kyrgyz, Latgalian, Latin, Latvian, Ligurian, Lithuanian, Livvi, Low Saxon, Luxembourgish, Macedonian, Maghrebi Arabic French, Malayalam, Maltese, Manx, Marathi, Mbya Guarani, Middle French, Moksha, Munduruku, Naga, Naija, Nayini, Neapolitan, Nenets, Nheengatu, North Sami, Northwest Gbaya, Norwegian, Occitan, Odia, Old Church Slavonic, Old East Slavic, Old English, Old French, Old Irish, Old Turkish, Ottoman Turkish, Pashto, Paumari, Persian, Pesh, Polish, Pomak, Portuguese, Romanian, Russian, Sanskrit, Scottish Gaelic, Serbian, Sindhi, Sinhala, Skolt Sami, Slovak, Slovenian, Soi, South Levantine Arabic, Spanish, Spanish Sign Language, Swedish, Swedish Sign Language, Tagalog, Tamil, Tatar, Teko, Telugu, Telugu English, Thai, Tswana, Tupinamba, Turkish, Turkish English, Turkish German, Ukrainian, Umbrian, Upper Sorbian, Urdu, Uyghur, Uzbek, Veps, Vietnamese, Welsh, Western Armenian, Western Sierra Puebla Nahuatl, Wolof, Xavante, Xibe, Yakut, Yoruba, Zaar */
	"ccomp",
	/** Bhojpuri, Bokota, Cantonese, Chinese, Classical Chinese, Indonesian, Javanese, Karo, Kazakh, Kiche, Korean, Munduruku, Odia, Swedish Sign Language, Telugu, Thai, Turkish, Vietnamese, Xibe */
	"clf",
	/** Abkhaz, Akkadian, Albanian, Alemannic, Amharic, Ancient Greek, Apurina, Arabic, Armenian, Assyrian, Azerbaijani, Bambara, Basque, Bavarian, Belarusian, Bengali, Bhojpuri, Bokota, Bororo, Breton, Bulgarian, Buryat, Cantonese, Catalan, Cebuano, Chinese, Classical Armenian, Classical Chinese, Coptic, Croatian, Czech, Danish, Egyptian, English, Erzya, Esperanto, Estonian, Faroese, Finnish, French, Frisian Dutch, Galician, Georgian, German, Greek, Guajajara, Guarani, Gujarati, Gwichin, Haitian Creole, Hausa, Hebrew, Highland Puebla Nahuatl, Hindi, Hittite, Hungarian, Icelandic, Ika, Indonesian, Irish, Italian, Japanese, Javanese, Kaapor, Kangri, Karelian, Karo, Kazakh, Khunsari, Kiche, Komi Zyrian, Korean, Kurmanji, Kyrgyz, Latin, Latvian, Lithuanian, Livvi, Low Saxon, Madi, Maghrebi Arabic French, Malayalam, Maltese, Manx, Marathi, Mbya Guarani, Moksha, Naga, Naija, Nayini, Nheengatu, North Sami, Northwest Gbaya, Norwegian, Occitan, Odia, Old East Slavic, Old French, Old Turkish, Ottoman Turkish, Pashto, Paumari, Persian, Pesh, Pomak, Portuguese, Romanian, Russian, Sanskrit, Scottish Gaelic, Serbian, Sindhi, Sinhala, Slovak, Spanish, Swedish, Swedish Sign Language, Tagalog, Tamil, Tatar, Teko, Telugu, Telugu English, Thai, Tswana, Tupinamba, Turkish, Turkish English, Turkish German, Ukrainian, Upper Sorbian, Urdu, Uyghur, Uzbek, Vietnamese, Welsh, Western Armenian, Western Sierra Puebla Nahuatl, Wolof, Xibe, Yakut, Yoruba, Zaar */
	"compound",
	/** Abaza, Abkhaz, Afrikaans, Akkadian, Akuntsu, Albanian, Alemannic, Amharic, Ancient Greek, Ancient Hebrew, Apurina, Arabic, Armenian, Assyrian, Azerbaijani, Bambara, Basque, Bavarian, Belarusian, Bengali, Bhojpuri, Bokota, Bororo, Breton, Bulgarian, Buryat, Cantonese, Cappadocian, Catalan, Cebuano, Chinese, Chukchi, Classical Armenian, Classical Chinese, Coptic, Croatian, Czech, Danish, Dutch, Egyptian, English, Erzya, Esperanto, Estonian, Faroese, Finnish, French, Frisian Dutch, Galician, Georgian, German, Gheg, Gothic, Greek, Guajajara, Gujarati, Gwichin, Haitian Creole, Hausa, Hebrew, Highland Puebla Nahuatl, Hindi, Hittite, Hungarian, Icelandic, Ika, Indonesian, Irish, Italian, Javanese, Kaapor, Kangri, Karelian, Karo, Kazakh, Khoekhoe, Kiche, Komi Permyak, Komi Zyrian, Korean, Kurmanji, Kyrgyz, Latgalian, Latin, Latvian, Ligurian, Lithuanian, Livvi, Low Saxon, Luxembourgish, Macedonian, Maghrebi Arabic French, Makurap, Malayalam, Maltese, Manx, Marathi, Mbya Guarani, Middle French, Moksha, Munduruku, Naga, Naija, Neapolitan, Nheengatu, North Sami, Northwest Gbaya, Norwegian, Occitan, Odia, Old Church Slavonic, Old East Slavic, Old English, Old French, Old Irish, Old Turkish, Ottoman Turkish, Pashto, Paumari, Persian, Pesh, Phrygian, Polish, Pomak, Portuguese, Romanian, Russian, Sanskrit, Scottish Gaelic, Serbian, Sindhi, Sinhala, Skolt Sami, Slovak, Slovenian, South Levantine Arabic, Spanish, Spanish Sign Language, Swedish, Swedish Sign Language, Tagalog, Tamil, Tatar, Teko, Telugu, Thai, Tswana, Tupinamba, Turkish, Turkish English, Turkish German, Ukrainian, Umbrian, Upper Sorbian, Urdu, Uyghur, Uzbek, Veps, Vietnamese, Welsh, Western Armenian, Western Sierra Puebla Nahuatl, Wolof, Xavante, Xibe, Yakut, Yoruba, Yupik, Zaar */
	"conj",
	/** Abaza, Abkhaz, Afrikaans, Akkadian, Albanian, Alemannic, Amharic, Ancient Greek, Ancient Hebrew, Apurina, Arabic, Armenian, Assyrian, Azerbaijani, Basque, Bavarian, Beja, Belarusian, Bhojpuri, Bokota, Bororo, Breton, Bulgarian, Buryat, Cantonese, Cappadocian, Catalan, Chinese, Chukchi, Classical Armenian, Classical Chinese, Coptic, Croatian, Czech, Danish, Dutch, Egyptian, English, Erzya, Esperanto, Estonian, Faroese, Finnish, French, Frisian Dutch, Galician, Georgian, German, Gheg, Greek, Gujarati, Haitian Creole, Hausa, Hebrew, Highland Puebla Nahuatl, Hindi, Hittite, Hungarian, Icelandic, Ika, Indonesian, Irish, Italian, Japanese, Javanese, Kangri, Karelian, Karo, Kazakh, Khoekhoe, Komi Permyak, Komi Zyrian, Korean, Kurmanji, Kyrgyz, Latin, Latvian, Ligurian, Lithuanian, Livvi, Low Saxon, Luxembourgish, Macedonian, Madi, Maghrebi Arabic French, Malayalam, Maltese, Manx, Marathi, Mbya Guarani, Middle French, Moksha, Munduruku, Naga, Naija, Neapolitan, Nheengatu, North Sami, Northwest Gbaya, Norwegian, Occitan, Odia, Old Church Slavonic, Old East Slavic, Old English, Old French, Old Irish, Old Turkish, Ottoman Turkish, Pashto, Paumari, Persian, Pesh, Phrygian, Polish, Portuguese, Romanian, Russian, Sanskrit, Scottish Gaelic, Serbian, Sindhi, Sinhala, Skolt Sami, Slovak, Slovenian, Spanish, Swedish, Swedish Sign Language, Tamil, Teko, Thai, Tswana, Turkish, Turkish German, Ukrainian, Umbrian, Upper Sorbian, Urdu, Uyghur, Uzbek, Veps, Vietnamese, Welsh, Western Armenian, Western Sierra Puebla Nahuatl, Wolof, Xavante, Xibe, Yakut, Yoruba, Zaar */
	"cop",
	/** Abaza, Abkhaz, Afrikaans, Akkadian, Albanian, Alemannic, Amharic, Ancient Greek, Ancient Hebrew, Apurina, Arabic, Armenian, Assyrian, Azerbaijani, Basque, Bavarian, Belarusian, Bhojpuri, Bokota, Breton, Bulgarian, Buryat, Cantonese, Cappadocian, Catalan, Cebuano, Chinese, Classical Armenian, Classical Chinese, Coptic, Croatian, Czech, Dutch, Egyptian, English, Erzya, Estonian, Faroese, Finnish, French, Frisian Dutch, Galician, Georgian, German, Gheg, Greek, Hausa, Hebrew, Highland Puebla Nahuatl, Hittite, Hungarian, Icelandic, Ika, Indonesian, Irish, Italian, Japanese, Javanese, Kazakh, Khoekhoe, Kiche, Komi Permyak, Komi Zyrian, Korean, Kurmanji, Kyrgyz, Latgalian, Latin, Latvian, Ligurian, Lithuanian, Low Saxon, Macedonian, Maghrebi Arabic French, Malayalam, Maltese, Marathi, Mbya Guarani, Middle French, Moksha, Naga, Naija, Nheengatu, North Sami, Northwest Gbaya, Norwegian, Occitan, Old Church Slavonic, Old East Slavic, Old English, Old French, Old Irish, Ottoman Turkish, Pashto, Persian, Pesh, Phrygian, Polish, Pomak, Portuguese, Romanian, Russian, Sanskrit, Serbian, Sinhala, Slovak, Slovenian, Spanish, Swedish, Swedish Sign Language, Tagalog, Tamil, Telugu, Thai, Turkish, Turkish German, Ukrainian, Umbrian, Upper Sorbian, Uyghur, Uzbek, Veps, Vietnamese, Welsh, Western Armenian, Western Sierra Puebla Nahuatl, Wolof, Xibe, Yakut, Yoruba, Zaar */
	"csubj",
	/** Afrikaans, Akkadian, Akuntsu, Alemannic, Amharic, Ancient Greek, Apurina, Arabic, Armenian, Bambara, Basque, Bavarian, Beja, Belarusian, Bhojpuri, Bokota, Bororo, Breton, Cappadocian, Catalan, Chinese, Chukchi, Coptic, Croatian, Czech, Danish, Egyptian, English, Erzya, Estonian, Faroese, Finnish, French, Frisian Dutch, Galician, Georgian, German, Gheg, Gothic, Greek, Guajajara, Guarani, Gujarati, Gwichin, Haitian Creole, Hausa, Hebrew, Highland Puebla Nahuatl, Hindi, Hittite, Hungarian, Icelandic, Ika, Indonesian, Irish, Italian, Japanese, Javanese, Kaapor, Kangri, Karo, Kazakh, Kiche, Komi Zyrian, Korean, Kurmanji, Latin, Latvian, Ligurian, Lithuanian, Low Saxon, Luxembourgish, Madi, Maghrebi Arabic French, Makurap, Maltese, Manx, Mbya Guarani, Middle French, Moksha, Munduruku, Naija, Nenets, Nheengatu, Northwest Gbaya, Occitan, Old Church Slavonic, Old East Slavic, Old French, Ottoman Turkish, Paumari, Persian, Pesh, Phrygian, Polish, Pomak, Portuguese, Romanian, Russian, Sanskrit, Scottish Gaelic, Serbian, Sindhi, Sinhala, Skolt Sami, Slovak, Slovenian, South Levantine Arabic, Spanish, Spanish Sign Language, Swedish, Swedish Sign Language, Tatar, Teko, Telugu, Telugu English, Thai, Tupinamba, Turkish, Upper Sorbian, Urdu, Uyghur, Vietnamese, Western Armenian, Western Sierra Puebla Nahuatl, Xavante, Yakut, Zaar */
	"dep",
	/** Abaza, Abkhaz, Afrikaans, Akkadian, Akuntsu, Albanian, Alemannic, Amharic, Ancient Greek, Ancient Hebrew, Apurina, Arabic, Armenian, Assyrian, Azerbaijani, Bambara, Basque, Bavarian, Beja, Belarusian, Bengali, Bhojpuri, Bokota, Bororo, Breton, Bulgarian, Buryat, Cantonese, Cappadocian, Catalan, Cebuano, Chinese, Chukchi, Classical Armenian, Classical Chinese, Coptic, Croatian, Czech, Danish, Dutch, Egyptian, English, Erzya, Esperanto, Estonian, Faroese, Finnish, French, Frisian Dutch, Galician, Georgian, German, Gheg, Gothic, Greek, Guajajara, Guarani, Gujarati, Gwichin, Haitian Creole, Hausa, Hebrew, Highland Puebla Nahuatl, Hindi, Hittite, Hungarian, Icelandic, Ika, Indonesian, Irish, Italian, Japanese, Javanese, Kaapor, Kangri, Karelian, Karo, Kazakh, Khoekhoe, Kiche, Komi Permyak, Komi Zyrian, Korean, Kurmanji, Kyrgyz, Latgalian, Latin, Latvian, Ligurian, Lithuanian, Livvi, Low Saxon, Luxembourgish, Macedonian, Maghrebi Arabic French, Malayalam, Maltese, Manx, Marathi, Mbya Guarani, Middle French, Moksha, Munduruku, Naga, Naija, Neapolitan, Nenets, Nheengatu, North Sami, Northwest Gbaya, Norwegian, Occitan, Odia, Old Church Slavonic, Old East Slavic, Old English, Old French, Old Irish, Old Turkish, Ottoman Turkish, Pashto, Paumari, Persian, Pesh, Phrygian, Polish, Pomak, Portuguese, Romanian, Russian, Sanskrit, Scottish Gaelic, Serbian, Sindhi, Sinhala, Skolt Sami, Slovak, Slovenian, South Levantine Arabic, Spanish, Spanish Sign Language, Swedish, Swedish Sign Language, Tagalog, Tamil, Tatar, Teko, Telugu, Telugu English, Thai, Tupinamba, Turkish, Turkish English, Turkish German, Ukrainian, Umbrian, Upper Sorbian, Urdu, Uyghur, Uzbek, Veps, Vietnamese, Welsh, Western Armenian, Western Sierra Puebla Nahuatl, Wolof, Xavante, Xibe, Yakut, Yoruba, Yupik, Zaar */
	"det",
	/** Abaza, Abkhaz, Akkadian, Akuntsu, Albanian, Amharic, Ancient Greek, Ancient Hebrew, Apurina, Arabic, Armenian, Azerbaijani, Bambara, Basque, Bavarian, Beja, Belarusian, Bengali, Bhojpuri, Bokota, Bororo, Breton, Bulgarian, Buryat, Cantonese, Cappadocian, Catalan, Cebuano, Chinese, Chukchi, Classical Armenian, Classical Chinese, Coptic, Croatian, Czech, Danish, Egyptian, English, Erzya, Estonian, Faroese, Finnish, French, Frisian Dutch, Galician, Georgian, German, Gheg, Gothic, Greek, Guajajara, Guarani, Gujarati, Gwichin, Haitian Creole, Hausa, Hebrew, Highland Puebla Nahuatl, Hindi, Hittite, Hungarian, Icelandic, Ika, Indonesian, Irish, Italian, Japanese, Javanese, Kaapor, Kangri, Karelian, Karo, Kazakh, Khoekhoe, Kiche, Komi Permyak, Komi Zyrian, Korean, Kurmanji, Kyrgyz, Latgalian, Latin, Latvian, Ligurian, Lithuanian, Livvi, Low Saxon, Macedonian, Madi, Maghrebi Arabic French, Makurap, Maltese, Manx, Marathi, Mbya Guarani, Middle French, Moksha, Munduruku, Naga, Naija, Nenets, Nheengatu, North Sami, Northwest Gbaya, Norwegian, Occitan, Odia, Old Church Slavonic, Old East Slavic, Old French, Old Irish, Ottoman Turkish, Persian, Pesh, Polish, Pomak, Portuguese, Romanian, Russian, Sanskrit, Scottish Gaelic, Serbian, Sindhi, Skolt Sami, Slovak, Slovenian, South Levantine Arabic, Spanish, Spanish Sign Language, Swedish, Swedish Sign Language, Tagalog, Tatar, Teko, Telugu, Thai, Tswana, Tupinamba, Turkish, Turkish English, Turkish German, Ukrainian, Upper Sorbian, Urdu, Uyghur, Uzbek, Vietnamese, Welsh, Western Armenian, Western Sierra Puebla Nahuatl, Wolof, Xavante, Xibe, Yakut, Yoruba, Zaar */
	"discourse",
	/** Abaza, Abkhaz, Akuntsu, Ancient Greek, Ancient Hebrew, Apurina, Arabic, Armenian, Bambara, Basque, Bavarian, Beja, Belarusian, Breton, Cantonese, Cappadocian, Catalan, Chinese, Chukchi, Classical Armenian, Classical Chinese, Coptic, Croatian, Danish, Egyptian, English, Erzya, Finnish, French, Frisian Dutch, German, Gheg, Gothic, Greek, Guajajara, Gujarati, Haitian Creole, Hausa, Hebrew, Highland Puebla Nahuatl, Hindi, Hittite, Hungarian, Icelandic, Ika, Indonesian, Irish, Italian, Japanese, Karo, Khoekhoe, Kiche, Komi Permyak, Komi Zyrian, Korean, Kurmanji, Latin, Latvian, Ligurian, Lithuanian, Low Saxon, Maghrebi Arabic French, Maltese, Marathi, Mbya Guarani, Middle French, Moksha, Munduruku, Naija, Nheengatu, Northwest Gbaya, Norwegian, Occitan, Odia, Old Church Slavonic, Old East Slavic, Old French, Old Irish, Ottoman Turkish, Pashto, Paumari, Persian, Pesh, Phrygian, Pomak, Portuguese, Russian, Sanskrit, Scottish Gaelic, Sindhi, Skolt Sami, Slovenian, Spanish, Swedish, Teko, Telugu, Thai, Tupinamba, Turkish, Turkish German, Ukrainian, Urdu, Uyghur, Vietnamese, Western Armenian, Western Sierra Puebla Nahuatl, Wolof, Xavante, Yakut, Zaar */
	"dislocated",
	/** Albanian, Alemannic, Amharic, Ancient Hebrew, Arabic, Armenian, Bavarian, Belarusian, Breton, Bulgarian, Cappadocian, Catalan, Classical Chinese, Coptic, Croatian, Danish, Dutch, Egyptian, English, Erzya, Faroese, Finnish, French, Frisian Dutch, Galician, Georgian, German, Gheg, Greek, Hebrew, Hittite, Icelandic, Irish, Italian, Khoekhoe, Komi Permyak, Ligurian, Low Saxon, Macedonian, Madi, Maghrebi Arabic French, Maltese, Middle French, Moksha, Neapolitan, Nheengatu, Norwegian, Occitan, Old East Slavic, Old English, Old French, Pomak, Portuguese, Romanian, Russian, Serbian, Skolt Sami, Slovenian, Spanish, Swedish, Tswana, Turkish German, Ukrainian, Umbrian, Uyghur, Uzbek, Vietnamese, Welsh, Western Armenian, Wolof, Yoruba */
	"expl",
	/** Abaza, Afrikaans, Akkadian, Albanian, Alemannic, Amharic, Ancient Greek, Ancient Hebrew, Arabic, Armenian, Azerbaijani, Bambara, Basque, Bavarian, Beja, Belarusian, Bengali, Bhojpuri, Breton, Bulgarian, Buryat, Catalan, Cebuano, Chinese, Classical Armenian, Classical Chinese, Coptic, Croatian, Czech, Danish, Dutch, Egyptian, English, Erzya, Estonian, Faroese, Finnish, French, Frisian Dutch, Galician, Georgian, German, Gheg, Gothic, Greek, Guajajara, Gujarati, Gwichin, Haitian Creole, Hausa, Hebrew, Highland Puebla Nahuatl, Hindi, Hungarian, Icelandic, Indonesian, Irish, Italian, Japanese, Javanese, Karelian, Kazakh, Khoekhoe, Kiche, Komi Permyak, Komi Zyrian, Korean, Kurmanji, Kyrgyz, Latgalian, Latin, Latvian, Ligurian, Lithuanian, Livvi, Low Saxon, Macedonian, Maghrebi Arabic French, Maltese, Manx, Marathi, Mbya Guarani, Middle French, Moksha, Naga, Naija, Nheengatu, Occitan, Old Church Slavonic, Old East Slavic, Old English, Old French, Ottoman Turkish, Pashto, Persian, Phrygian, Polish, Pomak, Portuguese, Romanian, Russian, Sanskrit, Scottish Gaelic, Serbian, Sindhi, Skolt Sami, Slovak, Slovenian, Spanish, Swedish, Tagalog, Tamil, Tatar, Teko, Thai, Tswana, Turkish, Turkish English, Turkish German, Ukrainian, Upper Sorbian, Uyghur, Vietnamese, Welsh, Western Armenian, Western Sierra Puebla Nahuatl, Wolof, Xibe, Yoruba, Zaar */
	"fixed",
	/** Abaza, Abkhaz, Afrikaans, Akkadian, Albanian, Alemannic, Amharic, Ancient Hebrew, Arabic, Armenian, Azerbaijani, Bambara, Basque, Bavarian, Belarusian, Bhojpuri, Bokota, Bororo, Bulgarian, Buryat, Cantonese, Catalan, Cebuano, Chinese, Chukchi, Classical Armenian, Classical Chinese, Coptic, Croatian, Czech, Danish, Dutch, Egyptian, English, Erzya, Estonian, Faroese, Finnish, French, Frisian Dutch, Galician, Georgian, German, Gheg, Greek, Guajajara, Gujarati, Gwichin, Haitian Creole, Hausa, Hebrew, Highland Puebla Nahuatl, Hindi, Hittite, Icelandic, Ika, Indonesian, Irish, Italian, Javanese, Kangri, Karelian, Khunsari, Kiche, Komi Zyrian, Korean, Kurmanji, Kyrgyz, Latin, Latvian, Ligurian, Lithuanian, Low Saxon, Luxembourgish, Macedonian, Maghrebi Arabic French, Malayalam, Maltese, Manx, Marathi, Mbya Guarani, Middle French, Moksha, Munduruku, Naga, Naija, Nayini, Neapolitan, Nheengatu, North Sami, Norwegian, Occitan, Odia, Old East Slavic, Old English, Old French, Old Irish, Ottoman Turkish, Pashto, Persian, Phrygian, Polish, Pomak, Portuguese, Romanian, Russian, Sanskrit, Scottish Gaelic, Serbian, Sindhi, Sinhala, Slovak, Slovenian, Soi, Spanish, Swedish, Swedish Sign Language, Tagalog, Tatar, Teko, Telugu, Tswana, Tupinamba, Turkish, Turkish English, Turkish German, Ukrainian, Umbrian, Upper Sorbian, Urdu, Uyghur, Uzbek, Veps, Vietnamese, Welsh, Western Armenian, Western Sierra Puebla Nahuatl, Wolof, Xavante, Xibe, Yoruba, Zaar */
	"flat",
	/** Amharic, Bavarian, Belarusian, English, Estonian, Finnish, French, Frisian Dutch, German, Greek, Gujarati, Haitian Creole, Hebrew, Highland Puebla Nahuatl, Hungarian, Indonesian, Irish, Italian, Javanese, Karelian, Khoekhoe, Kiche, Korean, Latvian, Livvi, Maghrebi Arabic French, Malayalam, Maltese, Marathi, Mbya Guarani, Nheengatu, Old East Slavic, Ottoman Turkish, Pashto, Persian, Phrygian, Portuguese, Romanian, Russian, Skolt Sami, Slovenian, Spanish, Swedish, Thai, Turkish, Ukrainian, Western Sierra Puebla Nahuatl, Yoruba */
	"goeswith",
	/** Abaza, Abkhaz, Afrikaans, Akkadian, Akuntsu, Albanian, Alemannic, Amharic, Ancient Greek, Apurina, Arabic, Armenian, Assyrian, Basque, Beja, Belarusian, Bengali, Bhojpuri, Bulgarian, Buryat, Cantonese, Cappadocian, Chinese, Classical Armenian, Classical Chinese, Coptic, Croatian, Czech, Danish, Dutch, English, Faroese, French, Frisian Dutch, Galician, Georgian, German, Gheg, Greek, Guajajara, Guarani, Gujarati, Gwichin, Haitian Creole, Hausa, Hebrew, Highland Puebla Nahuatl, Hindi, Hittite, Hungarian, Icelandic, Ika, Indonesian, Irish, Italian, Javanese, Kaapor, Kangri, Kazakh, Khoekhoe, Korean, Latgalian, Latin, Latvian, Ligurian, Lithuanian, Low Saxon, Luxembourgish, Macedonian, Maghrebi Arabic French, Malayalam, Maltese, Manx, Marathi, Middle French, Naga, Naija, Neapolitan, Nheengatu, Norwegian, Occitan, Odia, Old East Slavic, Old English, Old French, Ottoman Turkish, Paumari, Persian, Phrygian, Polish, Pomak, Portuguese, Romanian, Russian, Sanskrit, Serbian, Sindhi, Slovak, Slovenian, South Levantine Arabic, Spanish, Spanish Sign Language, Swedish, Swedish Sign Language, Tagalog, Tamil, Teko, Telugu, Telugu English, Thai, Tswana, Tupinamba, Turkish, Turkish German, Ukrainian, Umbrian, Upper Sorbian, Urdu, Uyghur, Uzbek, Vietnamese, Warlpiri, Welsh, Western Armenian, Western Sierra Puebla Nahuatl, Wolof, Xavante, Xibe, Yakut, Yoruba, Zaar */
	"iobj",
	/** Akkadian, Apurina, Armenian, Belarusian, Bhojpuri, Breton, Buryat, Classical Chinese, Croatian, Danish, Egyptian, English, Estonian, Frisian Dutch, Galician, Gheg, Guajajara, Hebrew, Hindi, Hungarian, Indonesian, Irish, Italian, Khoekhoe, Komi Permyak, Komi Zyrian, Korean, Lithuanian, Low Saxon, Macedonian, Maghrebi Arabic French, Maltese, Mbya Guarani, Moksha, Odia, Old East Slavic, Polish, Portuguese, Romanian, Russian, Serbian, Slovenian, Spanish, Swedish, Telugu, Turkish, Ukrainian, Upper Sorbian, Vietnamese, Western Armenian */
	"list",
	/** Abaza, Abkhaz, Afrikaans, Akkadian, Albanian, Alemannic, Amharic, Ancient Greek, Ancient Hebrew, Apurina, Arabic, Armenian, Assyrian, Azerbaijani, Bambara, Basque, Bavarian, Belarusian, Bengali, Bhojpuri, Bokota, Bororo, Breton, Bulgarian, Buryat, Cantonese, Cappadocian, Catalan, Cebuano, Chinese, Chukchi, Classical Armenian, Classical Chinese, Coptic, Croatian, Czech, Danish, Dutch, Egyptian, English, Erzya, Esperanto, Estonian, Faroese, Finnish, French, Frisian Dutch, Galician, Georgian, German, Gheg, Gothic, Greek, Guajajara, Gujarati, Gwichin, Haitian Creole, Hausa, Hebrew, Highland Puebla Nahuatl, Hindi, Hittite, Hungarian, Icelandic, Ika, Indonesian, Irish, Italian, Japanese, Javanese, Kaapor, Kangri, Karelian, Karo, Kazakh, Khoekhoe, Khunsari, Kiche, Komi Permyak, Komi Zyrian, Korean, Kurmanji, Kyrgyz, Latgalian, Latin, Latvian, Ligurian, Lithuanian, Livvi, Low Saxon, Luxembourgish, Macedonian, Maghrebi Arabic French, Malayalam, Maltese, Manx, Marathi, Mbya Guarani, Middle French, Moksha, Munduruku, Naga, Naija, Nayini, Neapolitan, Nenets, Nheengatu, North Sami, Northwest Gbaya, Norwegian, Occitan, Odia, Old Church Slavonic, Old East Slavic, Old English, Old French, Old Irish, Old Turkish, Ottoman Turkish, Pashto, Paumari, Persian, Pesh, Phrygian, Polish, Pomak, Portuguese, Romanian, Russian, Sanskrit, Scottish Gaelic, Serbian, Sindhi, Sinhala, Skolt Sami, Slovak, Slovenian, South Levantine Arabic, Spanish, Spanish Sign Language, Swedish, Swedish Sign Language, Tagalog, Tamil, Tatar, Teko, Telugu, Thai, Tswana, Tupinamba, Turkish, Turkish English, Turkish German, Ukrainian, Umbrian, Upper Sorbian, Urdu, Uyghur, Uzbek, Veps, Vietnamese, Welsh, Western Armenian, Western Sierra Puebla Nahuatl, Wolof, Xavante, Xibe, Yoruba, Yupik, Zaar */
	"mark",
	/** Abaza, Abkhaz, Afrikaans, Akkadian, Akuntsu, Albanian, Alemannic, Amharic, Ancient Greek, Ancient Hebrew, Apurina, Arabic, Armenian, Assyrian, Azerbaijani, Bambara, Basque, Bavarian, Beja, Belarusian, Bengali, Bhojpuri, Bokota, Bororo, Breton, Bulgarian, Buryat, Cantonese, Cappadocian, Catalan, Cebuano, Chinese, Chukchi, Classical Armenian, Classical Chinese, Coptic, Croatian, Czech, Danish, Dutch, Egyptian, English, Erzya, Esperanto, Estonian, Faroese, Finnish, French, Frisian Dutch, Galician, Georgian, German, Gheg, Gothic, Greek, Guajajara, Guarani, Gujarati, Gwichin, Haitian Creole, Hausa, Hebrew, Highland Puebla Nahuatl, Hindi, Hittite, Hungarian, Icelandic, Ika, Indonesian, Irish, Italian, Japanese, Javanese, Kaapor, Kangri, Karelian, Karo, Kazakh, Khoekhoe, Khunsari, Kiche, Komi Permyak, Komi Zyrian, Korean, Kurmanji, Kyrgyz, Latgalian, Latin, Latvian, Ligurian, Lithuanian, Livvi, Low Saxon, Luxembourgish, Macedonian, Madi, Maghrebi Arabic French, Makurap, Malayalam, Maltese, Manx, Marathi, Mbya Guarani, Middle French, Moksha, Munduruku, Naga, Naija, Nayini, Neapolitan, Nenets, Nheengatu, North Sami, Northwest Gbaya, Norwegian, Occitan, Odia, Old Church Slavonic, Old East Slavic, Old French, Old Irish, Old Turkish, Ottoman Turkish, Pashto, Paumari, Persian, Pesh, Phrygian, Polish, Pomak, Portuguese, Romanian, Russian, Sanskrit, Scottish Gaelic, Serbian, Sindhi, Sinhala, Skolt Sami, Slovak, Slovenian, Soi, South Levantine Arabic, Spanish, Spanish Sign Language, Swedish, Swedish Sign Language, Tagalog, Tamil, Tatar, Teko, Telugu, Telugu English, Thai, Tswana, Tupinamba, Turkish, Turkish English, Turkish German, Ukrainian, Umbrian, Upper Sorbian, Urdu, Uyghur, Uzbek, Veps, Vietnamese, Welsh, Western Armenian, Western Sierra Puebla Nahuatl, Wolof, Xavante, Xibe, Yakut, Yoruba, Yupik, Zaar */
	"nmod",
	/** Abaza, Abkhaz, Afrikaans, Akkadian, Akuntsu, Albanian, Alemannic, Amharic, Ancient Greek, Ancient Hebrew, Apurina, Arabic, Armenian, Assyrian, Azerbaijani, Bambara, Basque, Bavarian, Beja, Belarusian, Bengali, Bhojpuri, Bokota, Bororo, Breton, Bulgarian, Buryat, Cantonese, Cappadocian, Catalan, Cebuano, Chinese, Chukchi, Classical Armenian, Classical Chinese, Coptic, Croatian, Czech, Danish, Dutch, Egyptian, English, Erzya, Esperanto, Estonian, Faroese, Finnish, French, Frisian Dutch, Galician, Georgian, German, Gheg, Gothic, Greek, Guarani, Gujarati, Gwichin, Haitian Creole, Hausa, Hebrew, Highland Puebla Nahuatl, Hindi, Hittite, Hungarian, Icelandic, Ika, Indonesian, Irish, Italian, Japanese, Javanese, Kaapor, Kangri, Karelian, Karo, Kazakh, Khoekhoe, Khunsari, Kiche, Komi Permyak, Komi Zyrian, Korean, Kurmanji, Kyrgyz, Latgalian, Latin, Latvian, Ligurian, Lithuanian, Livvi, Low Saxon, Luxembourgish, Macedonian, Madi, Maghrebi Arabic French, Makurap, Malayalam, Maltese, Manx, Marathi, Mbya Guarani, Middle French, Moksha, Munduruku, Naga, Naija, Nayini, Neapolitan, Nenets, Nheengatu, North Sami, Northwest Gbaya, Norwegian, Occitan, Odia, Old Church Slavonic, Old East Slavic, Old English, Old French, Old Irish, Old Turkish, Ottoman Turkish, Pashto, Paumari, Persian, Pesh, Phrygian, Polish, Pomak, Portuguese, Romanian, Russian, Sanskrit, Scottish Gaelic, Serbian, Sindhi, Sinhala, Skolt Sami, Slovak, Slovenian, Soi, South Levantine Arabic, Spanish, Spanish Sign Language, Swedish, Swedish Sign Language, Tagalog, Tamil, Tatar, Teko, Telugu, Telugu English, Thai, Tswana, Tupinamba, Turkish, Turkish English, Turkish German, Ukrainian, Umbrian, Upper Sorbian, Urdu, Uyghur, Uzbek, Veps, Vietnamese, Warlpiri, Welsh, Western Armenian, Western Sierra Puebla Nahuatl, Wolof, Xavante, Xibe, Yakut, Yoruba, Yupik, Zaar */
	"nsubj",
	/** Abaza, Abkhaz, Afrikaans, Akkadian, Akuntsu, Albanian, Alemannic, Amharic, Ancient Greek, Ancient Hebrew, Apurina, Arabic, Armenian, Azerbaijani, Bambara, Basque, Bavarian, Beja, Belarusian, Bhojpuri, Bokota, Breton, Bulgarian, Buryat, Cantonese, Cappadocian, Catalan, Cebuano, Chinese, Chukchi, Classical Armenian, Classical Chinese, Coptic, Croatian, Czech, Danish, Dutch, Egyptian, English, Erzya, Esperanto, Estonian, Faroese, Finnish, French, Frisian Dutch, Galician, Georgian, German, Gheg, Gothic, Greek, Guajajara, Guarani, Gujarati, Gwichin, Haitian Creole, Hausa, Hebrew, Highland Puebla Nahuatl, Hindi, Hittite, Hungarian, Icelandic, Ika, Indonesian, Irish, Italian, Japanese, Javanese, Kaapor, Kangri, Karelian, Karo, Kazakh, Khoekhoe, Khunsari, Kiche, Komi Permyak, Komi Zyrian, Korean, Kurmanji, Kyrgyz, Latin, Latvian, Ligurian, Lithuanian, Livvi, Low Saxon, Macedonian, Maghrebi Arabic French, Malayalam, Maltese, Manx, Marathi, Mbya Guarani, Middle French, Moksha, Munduruku, Naga, Naija, Nayini, Nenets, Nheengatu, North Sami, Norwegian, Occitan, Odia, Old Church Slavonic, Old East Slavic, Old French, Old Irish, Old Turkish, Ottoman Turkish, Pashto, Persian, Pesh, Polish, Pomak, Portuguese, Romanian, Russian, Sanskrit, Scottish Gaelic, Serbian, Sindhi, Sinhala, Skolt Sami, Slovak, Slovenian, Soi, South Levantine Arabic, Spanish, Spanish Sign Language, Swedish, Swedish Sign Language, Tagalog, Tamil, Tatar, Teko, Telugu, Telugu English, Thai, Tupinamba, Turkish, Turkish English, Turkish German, Ukrainian, Umbrian, Upper Sorbian, Urdu, Uyghur, Uzbek, Veps, Vietnamese, Welsh, Western Armenian, Western Sierra Puebla Nahuatl, Wolof, Xavante, Xibe, Yakut, Yoruba, Yupik, Zaar */
	"nummod",
	/** Abaza, Abkhaz, Afrikaans, Akkadian, Akuntsu, Albanian, Alemannic, Amharic, Ancient Greek, Ancient Hebrew, Apurina, Arabic, Armenian, Assyrian, Azerbaijani, Bambara, Basque, Bavarian, Beja, Belarusian, Bengali, Bhojpuri, Bokota, Bororo, Breton, Bulgarian, Buryat, Cantonese, Cappadocian, Catalan, Cebuano, Chinese, Chukchi, Classical Armenian, Classical Chinese, Coptic, Croatian, Czech, Danish, Dutch, Egyptian, English, Erzya, Esperanto, Estonian, Faroese, Finnish, French, Frisian Dutch, Galician, Georgian, German, Gheg, Gothic, Greek, Guajajara, Guarani, Gujarati, Gwichin, Haitian Creole, Hausa, Hebrew, Highland Puebla Nahuatl, Hindi, Hittite, Hungarian, Icelandic, Ika, Indonesian, Irish, Italian, Japanese, Javanese, Kaapor, Kangri, Karelian, Karo, Kazakh, Khoekhoe, Khunsari, Kiche, Komi Permyak, Komi Zyrian, Korean, Kurmanji, Kyrgyz, Latgalian, Latin, Latvian, Ligurian, Lithuanian, Livvi, Low Saxon, Luxembourgish, Macedonian, Madi, Maghrebi Arabic French, Makurap, Malayalam, Maltese, Manx, Marathi, Mbya Guarani, Middle French, Moksha, Munduruku, Naga, Naija, Nayini, Neapolitan, Nenets, Nheengatu, North Sami, Northwest Gbaya, Norwegian, Occitan, Odia, Old Church Slavonic, Old East Slavic, Old English, Old French, Old Irish, Old Turkish, Ottoman Turkish, Pashto, Paumari, Persian, Pesh, Phrygian, Polish, Pomak, Portuguese, Romanian, Russian, Sanskrit, Scottish Gaelic, Serbian, Sindhi, Sinhala, Skolt Sami, Slovak, Slovenian, Soi, South Levantine Arabic, Spanish, Spanish Sign Language, Swedish, Swedish Sign Language, Tagalog, Tamil, Tatar, Teko, Telugu, Telugu English, Thai, Tswana, Tupinamba, Turkish, Turkish English, Turkish German, Ukrainian, Umbrian, Upper Sorbian, Urdu, Uyghur, Uzbek, Veps, Vietnamese, Warlpiri, Welsh, Western Armenian, Western Sierra Puebla Nahuatl, Wolof, Xavante, Xibe, Yakut, Yoruba, Yupik, Zaar */
	"obj",
	/** Abaza, Abkhaz, Afrikaans, Akkadian, Akuntsu, Albanian, Alemannic, Amharic, Ancient Greek, Ancient Hebrew, Apurina, Arabic, Armenian, Assyrian, Azerbaijani, Bambara, Basque, Bavarian, Beja, Belarusian, Bengali, Bhojpuri, Bokota, Bororo, Breton, Bulgarian, Buryat, Cantonese, Cappadocian, Catalan, Cebuano, Chinese, Chukchi, Classical Armenian, Classical Chinese, Coptic, Croatian, Czech, Danish, Dutch, Egyptian, English, Erzya, Esperanto, Estonian, Faroese, Finnish, French, Frisian Dutch, Galician, Georgian, German, Gheg, Gothic, Greek, Guajajara, Guarani, Gujarati, Gwichin, Haitian Creole, Hausa, Hebrew, Highland Puebla Nahuatl, Hindi, Hittite, Hungarian, Icelandic, Ika, Indonesian, Irish, Italian, Japanese, Javanese, Kaapor, Kangri, Karelian, Karo, Kazakh, Khoekhoe, Khunsari, Kiche, Komi Permyak, Komi Zyrian, Korean, Kurmanji, Kyrgyz, Latgalian, Latin, Latvian, Ligurian, Lithuanian, Livvi, Low Saxon, Luxembourgish, Macedonian, Madi, Maghrebi Arabic French, Makurap, Malayalam, Maltese, Manx, Marathi, Mbya Guarani, Middle French, Moksha, Munduruku, Naga, Nayini, Neapolitan, Nheengatu, North Sami, Northwest Gbaya, Norwegian, Occitan, Odia, Old Church Slavonic, Old East Slavic, Old English, Old French, Old Irish, Old Turkish, Ottoman Turkish, Pashto, Paumari, Persian, Pesh, Phrygian, Polish, Pomak, Portuguese, Romanian, Russian, Sanskrit, Scottish Gaelic, Serbian, Sindhi, Sinhala, Skolt Sami, Slovak, Slovenian, Soi, South Levantine Arabic, Spanish, Spanish Sign Language, Swedish, Swedish Sign Language, Tagalog, Tamil, Tatar, Teko, Telugu, Telugu English, Thai, Tswana, Tupinamba, Turkish, Turkish English, Turkish German, Ukrainian, Umbrian, Upper Sorbian, Urdu, Uyghur, Uzbek, Veps, Vietnamese, Warlpiri, Welsh, Western Armenian, Western Sierra Puebla Nahuatl, Wolof, Xavante, Xibe, Yakut, Yoruba, Yupik, Zaar */
	"obl",
	/** Abkhaz, Albanian, Ancient Greek, Ancient Hebrew, Arabic, Armenian, Azerbaijani, Bambara, Basque, Bavarian, Belarusian, Breton, Buryat, Chinese, Chukchi, Classical Armenian, Classical Chinese, Coptic, Croatian, Czech, Danish, Dutch, Egyptian, English, Erzya, Esperanto, Estonian, Faroese, Finnish, French, Frisian Dutch, Galician, Georgian, German, Gheg, Gothic, Greek, Guajajara, Gujarati, Hebrew, Highland Puebla Nahuatl, Hittite, Hungarian, Ika, Indonesian, Irish, Italian, Karelian, Kazakh, Khoekhoe, Komi Permyak, Komi Zyrian, Korean, Kurmanji, Kyrgyz, Latgalian, Latin, Latvian, Ligurian, Lithuanian, Livvi, Low Saxon, Luxembourgish, Macedonian, Malayalam, Maltese, Manx, Marathi, Middle French, Moksha, Naga, Naija, Neapolitan, Nenets, Norwegian, Occitan, Old Church Slavonic, Old East Slavic, Old English, Old French, Ottoman Turkish, Pesh, Phrygian, Polish, Pomak, Portuguese, Romanian, Russian, Sanskrit, Scottish Gaelic, Serbian, Skolt Sami, Slovak, Slovenian, Spanish, Swedish, Swedish Sign Language, Telugu, Tswana, Turkish, Turkish German, Ukrainian, Umbrian, Upper Sorbian, Uyghur, Welsh, Western Armenian, Western Sierra Puebla Nahuatl, Wolof, Yoruba */
	"orphan",
	/** Abaza, Abkhaz, Akkadian, Akuntsu, Albanian, Alemannic, Amharic, Ancient Greek, Ancient Hebrew, Arabic, Armenian, Assyrian, Azerbaijani, Bambara, Basque, Bavarian, Beja, Belarusian, Bengali, Bororo, Breton, Bulgarian, Buryat, Cantonese, Cappadocian, Catalan, Cebuano, Chinese, Chukchi, Classical Armenian, Classical Chinese, Coptic, Croatian, Czech, Danish, Dutch, Egyptian, English, Erzya, Esperanto, Estonian, Faroese, Finnish, French, Frisian Dutch, Galician, Georgian, German, Gheg, Gothic, Greek, Guajajara, Guarani, Gujarati, Haitian Creole, Hausa, Hebrew, Highland Puebla Nahuatl, Hindi, Hittite, Hungarian, Icelandic, Ika, Indonesian, Irish, Italian, Javanese, Kaapor, Karelian, Karo, Kazakh, Khoekhoe, Kiche, Komi Permyak, Komi Zyrian, Korean, Kurmanji, Kyrgyz, Latin, Latvian, Ligurian, Lithuanian, Livvi, Low Saxon, Macedonian, Madi, Maghrebi Arabic French, Makurap, Malayalam, Maltese, Manx, Marathi, Mbya Guarani, Middle French, Moksha, Munduruku, Naga, Naija, Nenets, Nheengatu, North Sami, Northwest Gbaya, Norwegian, Occitan, Odia, Old Church Slavonic, Old East Slavic, Old French, Old Irish, Ottoman Turkish, Pashto, Paumari, Persian, Pesh, Pomak, Portuguese, Romanian, Russian, Sanskrit, Scottish Gaelic, Serbian, Sindhi, Skolt Sami, Slovak, Slovenian, South Levantine Arabic, Spanish, Spanish Sign Language, Swedish, Tagalog, Tamil, Tatar, Teko, Telugu, Thai, Tupinamba, Turkish, Turkish English, Turkish German, Ukrainian, Upper Sorbian, Uyghur, Uzbek, Veps, Vietnamese, Welsh, Western Armenian, Western Sierra Puebla Nahuatl, Wolof, Xavante, Xibe, Yakut, Yoruba, Zaar */
	"parataxis",
	/** Abkhaz, Afrikaans, Akuntsu, Albanian, Alemannic, Amharic, Ancient Greek, Ancient Hebrew, Apurina, Arabic, Armenian, Assyrian, Azerbaijani, Bambara, Basque, Bavarian, Beja, Belarusian, Bengali, Bhojpuri, Bokota, Bororo, Breton, Bulgarian, Buryat, Cantonese, Cappadocian, Catalan, Cebuano, Chinese, Chukchi, Classical Armenian, Coptic, Croatian, Czech, Danish, Dutch, Egyptian, English, Erzya, Esperanto, Estonian, Faroese, Finnish, French, Galician, Georgian, German, Gheg, Greek, Guajajara, Guarani, Gujarati, Gwichin, Haitian Creole, Hausa, Hebrew, Highland Puebla Nahuatl, Hindi, Hungarian, Icelandic, Ika, Indonesian, Irish, Italian, Japanese, Javanese, Kaapor, Kangri, Karelian, Karo, Kazakh, Khoekhoe, Khunsari, Kiche, Komi Permyak, Komi Zyrian, Korean, Kurmanji, Kyrgyz, Latgalian, Latin, Latvian, Ligurian, Lithuanian, Livvi, Low Saxon, Luxembourgish, Macedonian, Madi, Maghrebi Arabic French, Makurap, Malayalam, Maltese, Manx, Marathi, Mbya Guarani, Middle French, Moksha, Munduruku, Naga, Naija, Nayini, Neapolitan, Nenets, Nheengatu, North Sami, Norwegian, Occitan, Odia, Old East Slavic, Old English, Old French, Old Irish, Old Turkish, Ottoman Turkish, Pashto, Paumari, Persian, Pesh, Phrygian, Polish, Pomak, Portuguese, Romanian, Russian, Sanskrit, Scottish Gaelic, Serbian, Sindhi, Sinhala, Skolt Sami, Slovak, Slovenian, Soi, South Levantine Arabic, Spanish, Swedish, Tagalog, Tamil, Tatar, Teko, Telugu, Telugu English, Thai, Tswana, Tupinamba, Turkish, Turkish English, Turkish German, Ukrainian, Upper Sorbian, Urdu, Uyghur, Uzbek, Veps, Vietnamese, Warlpiri, Welsh, Western Armenian, Western Sierra Puebla Nahuatl, Wolof, Xavante, Xibe, Yakut, Yoruba, Yupik, Zaar */
	"punct",
	/** Abaza, Armenian, Bambara, Bavarian, Beja, Belarusian, Bokota, Cantonese, Chinese, Chukchi, Coptic, Czech, Danish, English, Erzya, Estonian, Finnish, French, Frisian Dutch, German, Gheg, Gujarati, Gwichin, Haitian Creole, Hausa, Hebrew, Highland Puebla Nahuatl, Ika, Irish, Italian, Japanese, Khoekhoe, Komi Zyrian, Korean, Latin, Latvian, Low Saxon, Macedonian, Maghrebi Arabic French, Malayalam, Maltese, Manx, Mbya Guarani, Middle French, Naga, Naija, Nenets, Nheengatu, Northwest Gbaya, Norwegian, Occitan, Old East Slavic, Pesh, Portuguese, Romanian, Russian, Scottish Gaelic, Skolt Sami, Slovenian, Spanish, Spanish Sign Language, Swedish, Swedish Sign Language, Thai, Turkish, Turkish German, Ukrainian, Uyghur, Vietnamese, Western Armenian, Western Sierra Puebla Nahuatl, Zaar */
	"reparandum",
	/** Abaza, Abkhaz, Afrikaans, Akkadian, Akuntsu, Albanian, Alemannic, Amharic, Ancient Greek, Ancient Hebrew, Apurina, Arabic, Armenian, Assyrian, Azerbaijani, Bambara, Basque, Bavarian, Beja, Belarusian, Bengali, Bhojpuri, Bokota, Bororo, Breton, Bulgarian, Buryat, Cantonese, Cappadocian, Catalan, Cebuano, Chinese, Chukchi, Classical Armenian, Classical Chinese, Coptic, Croatian, Czech, Danish, Dutch, Egyptian, English, Erzya, Esperanto, Estonian, Faroese, Finnish, French, Frisian Dutch, Galician, Georgian, German, Gheg, Gothic, Greek, Guajajara, Guarani, Gujarati, Gwichin, Haitian Creole, Hausa, Hebrew, Highland Puebla Nahuatl, Hindi, Hittite, Hungarian, Icelandic, Ika, Indonesian, Irish, Italian, Japanese, Javanese, Kaapor, Kangri, Karelian, Karo, Kazakh, Khoekhoe, Khunsari, Kiche, Komi Permyak, Komi Zyrian, Korean, Kurmanji, Kyrgyz, Latgalian, Latin, Latvian, Ligurian, Lithuanian, Livvi, Low Saxon, Luxembourgish, Macedonian, Madi, Maghrebi Arabic French, Makurap, Malayalam, Maltese, Manx, Marathi, Mbya Guarani, Middle French, Moksha, Munduruku, Naga, Naija, Nayini, Neapolitan, Nenets, Nheengatu, North Sami, Northwest Gbaya, Norwegian, Occitan, Odia, Old Church Slavonic, Old East Slavic, Old English, Old French, Old Irish, Old Turkish, Ottoman Turkish, Pashto, Paumari, Persian, Pesh, Phrygian, Polish, Pomak, Portuguese, Romanian, Russian, Sanskrit, Scottish Gaelic, Serbian, Sindhi, Sinhala, Skolt Sami, Slovak, Slovenian, Soi, South Levantine Arabic, Spanish, Spanish Sign Language, Swedish, Swedish Sign Language, Tagalog, Tamil, Tatar, Teko, Telugu, Telugu English, Thai, Tswana, Tupinamba, Turkish, Turkish English, Turkish German, Ukrainian, Umbrian, Upper Sorbian, Urdu, Uyghur, Uzbek, Veps, Vietnamese, Warlpiri, Welsh, Western Armenian, Western Sierra Puebla Nahuatl, Wolof, Xavante, Xibe, Yakut, Yoruba, Yupik, Zaar */
	"root",
	/** Abaza, Abkhaz, Akkadian, Ancient Greek, Ancient Hebrew, Apurina, Arabic, Armenian, Azerbaijani, Bambara, Basque, Bavarian, Beja, Belarusian, Bengali, Breton, Bulgarian, Buryat, Cantonese, Cappadocian, Catalan, Cebuano, Chinese, Chukchi, Classical Armenian, Classical Chinese, Coptic, Croatian, Czech, Danish, Egyptian, English, Erzya, Esperanto, Estonian, Faroese, Finnish, French, Frisian Dutch, Galician, Georgian, German, Gothic, Greek, Guajajara, Gujarati, Gwichin, Haitian Creole, Hausa, Hebrew, Highland Puebla Nahuatl, Hindi, Hittite, Hungarian, Icelandic, Indonesian, Irish, Italian, Javanese, Karelian, Kazakh, Khoekhoe, Kiche, Komi Permyak, Komi Zyrian, Korean, Kyrgyz, Latgalian, Latin, Latvian, Ligurian, Lithuanian, Livvi, Low Saxon, Luxembourgish, Macedonian, Madi, Maghrebi Arabic French, Malayalam, Maltese, Manx, Marathi, Mbya Guarani, Middle French, Moksha, Naga, Naija, Neapolitan, Nheengatu, North Sami, Northwest Gbaya, Occitan, Old Church Slavonic, Old East Slavic, Old English, Old French, Old Irish, Ottoman Turkish, Pashto, Paumari, Persian, Pesh, Polish, Pomak, Portuguese, Romanian, Russian, Sanskrit, Scottish Gaelic, Serbian, Sindhi, Skolt Sami, Slovak, Slovenian, Spanish, Spanish Sign Language, Swedish, Swedish Sign Language, Tagalog, Tamil, Teko, Telugu, Thai, Tswana, Tupinamba, Turkish, Turkish German, Ukrainian, Umbrian, Urdu, Uyghur, Uzbek, Vietnamese, Welsh, Western Armenian, Western Sierra Puebla Nahuatl, Xavante, Xibe, Yakut, Yoruba, Zaar */
	"vocative",
	/** Abaza, Abkhaz, Afrikaans, Akkadian, Akuntsu, Albanian, Alemannic, Amharic, Ancient Greek, Ancient Hebrew, Apurina, Arabic, Armenian, Assyrian, Azerbaijani, Bambara, Basque, Bavarian, Beja, Belarusian, Bengali, Bhojpuri, Bokota, Breton, Bulgarian, Buryat, Cantonese, Cappadocian, Catalan, Chinese, Chukchi, Classical Armenian, Classical Chinese, Coptic, Croatian, Czech, Danish, Dutch, Egyptian, English, Erzya, Esperanto, Estonian, Faroese, Finnish, French, Frisian Dutch, Galician, Georgian, German, Gheg, Gothic, Greek, Guajajara, Guarani, Gujarati, Haitian Creole, Hausa, Hebrew, Highland Puebla Nahuatl, Hindi, Hittite, Hungarian, Icelandic, Ika, Indonesian, Irish, Italian, Javanese, Kaapor, Kangri, Karelian, Karo, Kazakh, Khoekhoe, Kiche, Komi Permyak, Komi Zyrian, Korean, Kurmanji, Kyrgyz, Latgalian, Latin, Latvian, Ligurian, Lithuanian, Livvi, Low Saxon, Luxembourgish, Macedonian, Madi, Maghrebi Arabic French, Makurap, Malayalam, Maltese, Manx, Marathi, Mbya Guarani, Middle French, Moksha, Munduruku, Naga, Naija, Neapolitan, Nheengatu, North Sami, Northwest Gbaya, Norwegian, Occitan, Odia, Old Church Slavonic, Old East Slavic, Old English, Old French, Old Irish, Ottoman Turkish, Pashto, Paumari, Persian, Pesh, Polish, Pomak, Portuguese, Romanian, Russian, Sanskrit, Scottish Gaelic, Serbian, Sindhi, Sinhala, Skolt Sami, Slovak, Slovenian, South Levantine Arabic, Spanish, Spanish Sign Language, Swedish, Swedish Sign Language, Tagalog, Tamil, Tatar, Teko, Telugu, Telugu English, Thai, Tswana, Tupinamba, Turkish, Turkish English, Turkish German, Ukrainian, Umbrian, Upper Sorbian, Urdu, Uyghur, Uzbek, Veps, Vietnamese, Warlpiri, Welsh, Western Armenian, Western Sierra Puebla Nahuatl, Wolof, Xavante, Xibe, Yakut, Yoruba, Yupik, Zaar */
	"xcomp",
] as const;

// https://universaldependencies.org/survey-deprel.html
// document.querySelectorAll('h2').forEach(h => {
//  h.nextElementSibling.children[0].remove();
//  h.remove();
// })
// s|\(.*\): \(.*\)|/** \2 */^M"\1",
export const deprelSubtypes = [
	/** Ukrainian */
	"acl:adv",
	/** Chukchi, Sanskrit */
	"acl:attr",
	/** Swedish */
	"acl:cleft",
	/** Sanskrit */
	"acl:cont",
	/** Sanskrit */
	"acl:crel",
	/** Sanskrit */
	"acl:dpct",
	/** Portuguese */
	"acl:inf",
	/** Sanskrit */
	"acl:pred",
	/** Sanskrit */
	"acl:ptcp",
	/** Chukchi */
	"acl:relat",
	/** Abkhaz, Akkadian, Albanian, Alemannic, Ancient Greek, Ancient Hebrew, Apurina, Arabic, Armenian, Assyrian, Bavarian, Beja, Belarusian, Bengali, Bokota, Breton, Bulgarian, Cappadocian, Catalan, Chinese, Coptic, Czech, Danish, Dutch, Egyptian, English, Erzya, Esperanto, Estonian, Faroese, Finnish, French, Georgian, German, Greek, Gujarati, Haitian Creole, Hausa, Hebrew, Highland Puebla Nahuatl, Hindi, Hittite, Icelandic, Indonesian, Irish, Italian, Javanese, Karelian, Kazakh, Khoekhoe, Komi Permyak, Komi Zyrian, Korean, Kyrgyz, Latin, Ligurian, Lithuanian, Livvi, Low Saxon, Macedonian, Maghrebi Arabic French, Malayalam, Manx, Marathi, Middle French, Moksha, Naga, Naija, Nheengatu, North Sami, Northwest Gbaya, Norwegian, Occitan, Old East Slavic, Old French, Old Irish, Pashto, Paumari, Persian, Pesh, Polish, Pomak, Portuguese, Russian, Sanskrit, Scottish Gaelic, Sindhi, Skolt Sami, Slovak, Spanish, Swedish, Swedish Sign Language, Tagalog, Tamil, Telugu, Thai, Ukrainian, Umbrian, Urdu, Veps, Vietnamese, Welsh, Western Armenian, Western Sierra Puebla Nahuatl, Wolof, Xibe, Zaar */
	"acl:relcl",
	/** Vietnamese */
	"acl:subj",
	/** Vietnamese */
	"acl:tmod",
	/** Vietnamese */
	"acl:tonp",
	/** Latin */
	"advcl:abs",
	/** Sanskrit */
	"advcl:caus",
	/** Sanskrit */
	"advcl:ccomp",
	/** French, Haitian Creole, Hausa, Naija, Northwest Gbaya */
	"advcl:cleft",
	/** Ancient Greek, Erzya, Gothic, Italian, Latin, Old Church Slavonic, Old East Slavic */
	"advcl:cmp",
	/** Polish */
	"advcl:cmpr",
	/** Abkhaz */
	"advcl:compar",
	/** Sanskrit */
	"advcl:concess",
	/** Abkhaz, Sanskrit, Tamil, Telugu, Uyghur */
	"advcl:cond",
	/** Sanskrit */
	"advcl:consec",
	/** Abkhaz */
	"advcl:conv",
	/** Cantonese */
	"advcl:coverb",
	/** Sanskrit */
	"advcl:dpct",
	/** Sanskrit */
	"advcl:fin",
	/** Sanskrit */
	"advcl:lcl",
	/** Sanskrit */
	"advcl:manner",
	/** Vietnamese */
	"advcl:objective",
	/** Italian, Latin, Ukrainian */
	"advcl:pred",
	/** Abkhaz, Bokota, Ika */
	"advcl:purp",
	/** Abkhaz */
	"advcl:quote",
	/** Ancient Greek, Armenian, Bavarian, Czech, English, Georgian, German, Greek, Gujarati, Italian, Latin, Nheengatu, Polish, Scottish Gaelic, Western Armenian */
	"advcl:relcl",
	/** Abkhaz */
	"advcl:seq",
	/** Ukrainian */
	"advcl:svc",
	/** Romanian, Sanskrit */
	"advcl:tcl",
	/** Vietnamese */
	"advmod:adj",
	/** Polish */
	"advmod:arg",
	/** Erzya, Moksha */
	"advmod:cmp",
	/** Komi Permyak, Komi Zyrian */
	"advmod:deg",
	/** Ukrainian */
	"advmod:det",
	/** Cantonese, Chinese */
	"advmod:df",
	/** Vietnamese */
	"advmod:dir",
	/** Akkadian, Arabic, Armenian, Azerbaijani, Cappadocian, Catalan, Chukchi, Croatian, Czech, Hittite, Ika, Indonesian, Javanese, Khoekhoe, Komi Zyrian, Kyrgyz, Latgalian, Latin, Latvian, Lithuanian, Malayalam, Naga, Ottoman Turkish, Paumari, Polish, Pomak, Sanskrit, Sindhi, Sinhala, Slovak, South Levantine Arabic, Tamil, Tatar, Turkish, Turkish German, Ukrainian, Upper Sorbian, Uyghur, Western Armenian */
	"advmod:emph",
	/** Apurina, Danish, Georgian, Italian, Latin, Paumari */
	"advmod:lmod",
	/** Hittite */
	"advmod:loc",
	/** Hungarian */
	"advmod:locy",
	/** Hungarian */
	"advmod:mode",
	/** Buryat, Georgian, Italian, Kiche, Kurmanji, Latgalian, Latin, Latvian, Maltese, Polish, Skolt Sami, Ukrainian, Vietnamese, Western Sierra Puebla Nahuatl */
	"advmod:neg",
	/** Old French */
	"advmod:obl",
	/** Abkhaz */
	"advmod:q",
	/** Hungarian */
	"advmod:que",
	/** Hungarian */
	"advmod:tfrom",
	/** Hungarian */
	"advmod:tlocy",
	/** Italian, Latin, Romanian */
	"advmod:tmod",
	/** Hungarian */
	"advmod:to",
	/** Hungarian */
	"advmod:tto",
	/** Hungarian */
	"amod:att",
	/** Hungarian */
	"amod:attlvc",
	/** Polish */
	"amod:flat",
	/** Vietnamese */
	"appos:nmod",
	/** Turkish German */
	"appos:trans",
	/** Erzya */
	"aux:aspect",
	/** Armenian, Classical Armenian, French, Western Armenian */
	"aux:caus",
	/** Polish */
	"aux:clitic",
	/** Pashto, Polish */
	"aux:cnd",
	/** Armenian, Western Armenian */
	"aux:ex",
	/** Apurina */
	"aux:exhort",
	/** Pashto */
	"aux:fut",
	/** Pashto */
	"aux:hab",
	/** Erzya, Polish */
	"aux:imp",
	/** Chukchi, Erzya, Komi Permyak, Komi Zyrian, Maltese, Moksha, North Sami, Tamil */
	"aux:neg",
	/** Erzya, Moksha */
	"aux:opt",
	/** Gheg, Maltese */
	"aux:part",
	/** Afrikaans, Alemannic, Ancient Greek, Arabic, Assyrian, Bavarian, Belarusian, Bhojpuri, Bokota, Breton, Bulgarian, Buryat, Chinese, Czech, Dutch, English, Esperanto, Faroese, Finnish, French, Frisian Dutch, Galician, German, Hindi, Italian, Kangri, Karelian, Latin, Latvian, Lithuanian, Low Saxon, Macedonian, Maltese, Marathi, Middle French, Norwegian, Occitan, Old Church Slavonic, Old East Slavic, Old English, Old French, Pashto, Paumari, Persian, Polish, Pomak, Portuguese, Romanian, Russian, Scottish Gaelic, Sinhala, Slovak, Spanish, Swedish, Tamil, Thai, Turkish German, Ukrainian, Upper Sorbian, Vietnamese */
	"aux:pass",
	/** Pashto */
	"aux:perf",
	/** Komi Permyak, Pashto */
	"aux:pot",
	/** Cappadocian, Pomak, Turkish, Turkish German */
	"aux:q",
	/** French, Komi Zyrian */
	"aux:tense",
	/** Hebrew */
	"case:acc",
	/** Indonesian, Javanese */
	"case:adv",
	/** Maltese, Middle French, Old French */
	"case:det",
	/** Hebrew */
	"case:gen",
	/** Armenian, Cantonese, Chinese, Western Armenian */
	"case:loc",
	/** Welsh */
	"case:pred",
	/** Sanskrit */
	"case:sim",
	/** Irish, Old Irish, Scottish Gaelic */
	"case:voc",
	/** Middle French, Old French */
	"cc:nc",
	/** Ancient Greek, Arabic, Dutch, English, Erzya, Esperanto, Estonian, Faroese, Finnish, German, Gujarati, Hausa, Indonesian, Komi Permyak, Komi Zyrian, Moksha, North Sami, Old English, Ottoman Turkish, Persian, Polish, Portuguese, Romanian, Skolt Sami, Slovenian, Spanish, Thai, Turkish, Zaar */
	"cc:preconj",
	/** Polish */
	"ccomp:cleft",
	/** Abkhaz */
	"ccomp:iobj",
	/** Abkhaz */
	"ccomp:lo",
	/** Abkhaz, Hungarian, Polish */
	"ccomp:obj",
	/** Hungarian */
	"ccomp:obl",
	/** Romanian */
	"ccomp:pmod",
	/** Abkhaz */
	"ccomp:poss",
	/** Hungarian */
	"ccomp:pred",
	/** Abkhaz */
	"ccomp:purp",
	/** Abkhaz */
	"ccomp:quote",
	/** Sanskrit */
	"ccomp:rel",
	/** Italian, Latin */
	"ccomp:relcl",
	/** Italian, Latin */
	"ccomp:reported",
	/** Abkhaz */
	"ccomp:ro",
	/** Georgian, Portuguese */
	"ccomp:speech",
	/** Cantonese, Vietnamese */
	"clf:det",
	/** Indonesian */
	"compound:a",
	/** Vietnamese */
	"compound:adj",
	/** Hebrew */
	"compound:affix",
	/** Vietnamese */
	"compound:amod",
	/** Vietnamese */
	"compound:apr",
	/** Vietnamese */
	"compound:atov",
	/** Sanskrit */
	"compound:coord",
	/** Cantonese, Chinese, Vietnamese */
	"compound:dir",
	/** Cantonese, Chinese */
	"compound:ext",
	/** Armenian, Azerbaijani, Bengali, Gujarati, Hindi, Kazakh, Khunsari, Korean, Kurmanji, Kyrgyz, Malayalam, Marathi, Nayini, Ottoman Turkish, Pashto, Persian, Pesh, Sinhala, Soi, Tamil, Tatar, Telugu, Turkish, Turkish German, Uyghur, Uzbek, Western Armenian */
	"compound:lvc",
	/** Sanskrit */
	"compound:name",
	/** Erzya, Finnish, Komi Zyrian, Livvi, Moksha, North Sami */
	"compound:nn",
	/** Abkhaz */
	"compound:pred",
	/** Hungarian */
	"compound:preverb",
	/** Vietnamese */
	"compound:pron",
	/** Abkhaz, Afrikaans, Alemannic, Arabic, Bavarian, Danish, Dutch, English, Erzya, Estonian, Faroese, Finnish, Frisian Dutch, German, Icelandic, Irish, Karelian, Komi Permyak, Low Saxon, Naga, Naija, Old Irish, Persian, Sinhala, Spanish, Swedish, Swedish Sign Language, Tamil, Thai, Turkish German, Vietnamese, Wolof, Yoruba, Zaar */
	"compound:prt",
	/** Cantonese */
	"compound:quant",
	/** Armenian, Azerbaijani, Bambara, Cebuano, Classical Armenian, Classical Chinese, Erzya, Greek, Hindi, Ika, Kurmanji, Low Saxon, Marathi, Naija, Ottoman Turkish, Pomak, Spanish Sign Language, Tagalog, Tamil, Telugu, Turkish, Turkish German, Uyghur, Uzbek, Vietnamese, Welsh, Western Armenian, Zaar */
	"compound:redup",
	/** Ancient Hebrew, Hebrew */
	"compound:smixut",
	/** Amharic, Armenian, Beja, Bokota, Chinese, Gujarati, Haitian Creole, Hausa, Khoekhoe, Kyrgyz, Malayalam, Marathi, Mbya Guarani, Naga, Naija, Northwest Gbaya, Pesh, Sinhala, Spanish Sign Language, Swedish Sign Language, Telugu, Ukrainian, Uzbek, Vietnamese, Western Armenian, Wolof, Yoruba */
	"compound:svc",
	/** Vietnamese */
	"compound:verbnoun",
	/** Vietnamese */
	"compound:vmod",
	/** Cantonese, Chinese */
	"compound:vo",
	/** Spanish Sign Language */
	"compound:vsc",
	/** Cantonese, Chinese */
	"compound:vv",
	/** Vietnamese */
	"compound:z",
	/** Latin */
	"conj:expl",
	/** Abkhaz */
	"conj:q",
	/** Northwest Gbaya */
	"conj:redup",
	/** Ukrainian */
	"conj:svc",
	/** Malayalam */
	"cop:emph",
	/** Maltese */
	"cop:expl",
	/** Polish */
	"cop:locat",
	/** Latin */
	"cop:outer",
	/** Finnish, Karelian, Livvi, Marathi */
	"cop:own",
	/** Vietnamese */
	"csubj:asubj",
	/** Classical Armenian */
	"csubj:caus",
	/** Irish, Latin, Manx, Scottish Gaelic */
	"csubj:cleft",
	/** Erzya, Estonian, Finnish, Irish, Komi Zyrian, Livvi, Manx, Moksha, Scottish Gaelic, Turkish, Veps */
	"csubj:cop",
	/** Abkhaz, Belarusian, Classical Chinese, Dutch, Egyptian, English, Georgian, Hebrew, Japanese, Javanese, Khoekhoe, Latin, Low Saxon, Naga, Naija, Norwegian, Old East Slavic, Portuguese, Russian, Scottish Gaelic, Swedish, Turkish, Wolof */
	"csubj:outer",
	/** Albanian, Amharic, Ancient Greek, Arabic, Armenian, Belarusian, Bulgarian, Catalan, Chinese, Classical Armenian, Classical Chinese, Czech, Egyptian, English, French, German, Gothic, Greek, Hebrew, Indonesian, Italian, Javanese, Khoekhoe, Korean, Latin, Latvian, Lithuanian, Norwegian, Old Church Slavonic, Old East Slavic, Polish, Pomak, Portuguese, Romanian, Russian, Sanskrit, Slovak, Spanish, Swedish, Vietnamese, Western Armenian */
	"csubj:pass",
	/** Abkhaz */
	"csubj:quote",
	/** Italian, Latin */
	"csubj:relcl",
	/** Latin */
	"csubj:reported",
	/** Vietnamese */
	"csubj:vsubj",
	/** Kiche */
	"dep:agr",
	/** Upper Sorbian */
	"dep:alt",
	/** Yupik */
	"dep:ana",
	/** Yupik */
	"dep:aux",
	/** Beja, French */
	"dep:comp",
	/** Beja, Pesh */
	"dep:conj",
	/** Yupik */
	"dep:cop",
	/** Turkish */
	"dep:der",
	/** Yupik */
	"dep:emo",
	/** Beja */
	"dep:flat",
	/** Yupik */
	"dep:infl",
	/** Yupik */
	"dep:mark",
	/** Mbya Guarani */
	"dep:mod",
	/** Yupik */
	"dep:pos",
	/** Beja */
	"dep:redup",
	/** Abaza */
	"dep:repeat",
	/** Kiche */
	"dep:ss",
	/** Albanian */
	"det:adj",
	/** Albanian */
	"det:noun",
	/** Croatian, Czech, Latin, Polish, Serbian, Slovak, Ukrainian, Upper Sorbian */
	"det:numgov",
	/** Czech, Polish, Ukrainian */
	"det:nummod",
	/** Vietnamese */
	"det:pmod",
	/** Akkadian, Albanian, Armenian, Bavarian, Georgian, German, Irish, Italian, Korean, Low Saxon, Luxembourgish, Nenets, Polish, Portuguese, Sinhala, Western Armenian */
	"det:poss",
	/** English, Italian, Persian */
	"det:predet",
	/** Albanian */
	"det:pron",
	/** Bambara */
	"det:rel",
	/** Hittite */
	"discourse:conn",
	/** Irish, Italian, Romanian */
	"discourse:emo",
	/** Occitan */
	"discourse:enunc",
	/** Slovenian, Spanish */
	"discourse:filler",
	/** Polish */
	"discourse:intj",
	/** Northwest Gbaya */
	"discourse:participant",
	/** Turkish */
	"discourse:q",
	/** Cantonese, Chinese, Classical Chinese, Northwest Gbaya */
	"discourse:sp",
	/** Latin */
	"dislocated:advcl",
	/** Latin */
	"dislocated:ccomp",
	/** Mbya Guarani */
	"dislocated:cleft",
	/** Latin */
	"dislocated:csubj",
	/** Beja */
	"dislocated:mod",
	/** Latin */
	"dislocated:nsubj",
	/** Beja, Latin */
	"dislocated:obj",
	/** Latin */
	"dislocated:obl",
	/** Beja */
	"dislocated:subj",
	/** French */
	"expl:comp",
	/** Italian, Khoekhoe, Ligurian, Polish, Pomak, Portuguese, Romanian, Spanish */
	"expl:impers",
	/** Catalan, Czech, French, Hittite, Italian, Portuguese, Romanian, Slovak, Spanish, Upper Sorbian */
	"expl:pass",
	/** Romanian */
	"expl:poss",
	/** Bavarian, Czech, Dutch, Egyptian, French, German, Gothic, Italian, Ligurian, Low Saxon, Luxembourgish, Macedonian, Maghrebi Arabic French, Old Church Slavonic, Old East Slavic, Polish, Pomak, Portuguese, Romanian, Slovak, Spanish, Turkish German, Upper Sorbian */
	"expl:pv",
	/** French, Naija */
	"expl:subj",
	/** Ukrainian */
	"flat:abs",
	/** Vietnamese */
	"flat:date",
	/** Armenian, Western Armenian */
	"flat:dist",
	/** Arabic, Belarusian, Buryat, Chinese, Chukchi, Classical Chinese, Croatian, Egyptian, English, Estonian, Faroese, Finnish, French, Galician, Georgian, Hausa, Icelandic, Indonesian, Irish, Italian, Javanese, Khoekhoe, Komi Zyrian, Latin, Latvian, Lithuanian, Livvi, Naga, Naija, Norwegian, Old East Slavic, Old Irish, Pashto, Persian, Polish, Portuguese, Russian, Scottish Gaelic, Slovenian, South Levantine Arabic, Ukrainian, Upper Sorbian, Vietnamese, Zaar */
	"flat:foreign",
	/** Western Armenian */
	"flat:frac",
	/** Russian */
	"flat:goeswith",
	/** Latin */
	"flat:gov",
	/** Abkhaz, Ancient Greek, Ancient Hebrew, Armenian, Belarusian, Breton, Chinese, Chukchi, Erzya, Faroese, Finnish, French, Frisian Dutch, Galician, Georgian, German, Gothic, Haitian Creole, Hausa, Hebrew, Hindi, Hungarian, Icelandic, Indonesian, Irish, Italian, Javanese, Karelian, Kazakh, Khoekhoe, Komi Permyak, Komi Zyrian, Korean, Latgalian, Latin, Latvian, Livvi, Maltese, Moksha, Naga, Northwest Gbaya, Norwegian, Old Church Slavonic, Old East Slavic, Ottoman Turkish, Persian, Pesh, Portuguese, Russian, Scottish Gaelic, Skolt Sami, Slovenian, Spanish, Swedish, Thai, Ukrainian, Vietnamese, Welsh, Western Armenian, Xibe, Zaar */
	"flat:name",
	/** Khoekhoe, Komi Zyrian, Persian */
	"flat:num",
	/** Vietnamese */
	"flat:number",
	/** Armenian, Ukrainian, Western Armenian */
	"flat:range",
	/** Italian, Latin, Vietnamese */
	"flat:redup",
	/** Khoekhoe */
	"flat:reparandum",
	/** Ukrainian */
	"flat:repeat",
	/** Ukrainian */
	"flat:sibl",
	/** Vietnamese */
	"flat:time",
	/** Khoekhoe, Ukrainian */
	"flat:title",
	/** Classical Chinese */
	"flat:vv",
	/** Armenian, French, Western Armenian */
	"iobj:agent",
	/** Khoekhoe, Wolof */
	"iobj:appl",
	/** Tagalog */
	"iobj:patient",
	/** Cantonese, Chinese, Xibe */
	"mark:adv",
	/** Old French */
	"mark:advmod",
	/** Old Irish */
	"mark:int",
	/** Vietnamese */
	"mark:pcomp",
	/** Xibe */
	"mark:plur",
	/** Chinese, Irish, Scottish Gaelic */
	"mark:prt",
	/** Hebrew */
	"mark:q",
	/** Cantonese, Chinese, Xibe */
	"mark:rel",
	/** Sanskrit */
	"mark:sim",
	/** Welsh */
	"nmod:agent",
	/** French, Sanskrit */
	"nmod:appos",
	/** Polish, Yupik */
	"nmod:arg",
	/** Hungarian */
	"nmod:att",
	/** Hungarian */
	"nmod:attlvc",
	/** Chukchi */
	"nmod:attr",
	/** Moksha */
	"nmod:bahuv",
	/** Uyghur */
	"nmod:cau",
	/** Turkish, Uyghur */
	"nmod:comp",
	/** English */
	"nmod:desc",
	/** Hittite */
	"nmod:det",
	/** Polish */
	"nmod:flat",
	/** Breton */
	"nmod:gen",
	/** Erzya, Finnish, Moksha */
	"nmod:gobj",
	/** Erzya, Finnish, Karelian */
	"nmod:gsubj",
	/** Georgian */
	"nmod:iobj",
	/** Indonesian, Italian, Javanese */
	"nmod:lmod",
	/** Georgian */
	"nmod:name",
	/** Armenian, English, Western Armenian */
	"nmod:npmod",
	/** Komi Zyrian */
	"nmod:obj",
	/** Hungarian */
	"nmod:obl",
	/** Turkish, Uyghur */
	"nmod:part",
	/** Abkhaz, Akkadian, Albanian, Alemannic, Ancient Greek, Ancient Hebrew, Apurina, Arabic, Armenian, Assyrian, Azerbaijani, Bambara, Beja, Bengali, Bokota, Breton, Chukchi, Coptic, Danish, Dutch, Egyptian, English, Erzya, Esperanto, Estonian, Faroese, Finnish, Frisian Dutch, German, Gujarati, Hebrew, Hindi, Icelandic, Ika, Indonesian, Irish, Italian, Javanese, Karelian, Kazakh, Khoekhoe, Khunsari, Komi Permyak, Komi Zyrian, Korean, Kurmanji, Kyrgyz, Latin, Livvi, Low Saxon, Luxembourgish, Macedonian, Malayalam, Maltese, Manx, Marathi, Moksha, Naga, Naija, Nayini, Nenets, Nheengatu, North Sami, Norwegian, Old English, Old Irish, Ottoman Turkish, Paumari, Persian, Polish, Sanskrit, Scottish Gaelic, Sinhala, Skolt Sami, Soi, South Levantine Arabic, Swedish, Swedish Sign Language, Tagalog, Tamil, Telugu, Thai, Turkish, Uyghur, Uzbek, Vietnamese, Warlpiri, Welsh, Western Armenian, Wolof, Xibe, Zaar */
	"nmod:poss",
	/** Old Irish */
	"nmod:pre",
	/** Georgian, Polish, Sanskrit */
	"nmod:pred",
	/** Komi Zyrian */
	"nmod:prp",
	/** Abkhaz */
	"nmod:quote",
	/** Welsh */
	"nmod:redup",
	/** Chukchi */
	"nmod:relat",
	/** Komi Zyrian */
	"nmod:subj",
	/** Chinese, English, Gujarati, Indonesian, Irish, Javanese, Pomak, Portuguese, Romanian, Sinhala, Telugu, Turkish, Uyghur, Vietnamese */
	"nmod:tmod",
	/** Coptic, English, Hebrew, Scottish Gaelic */
	"nmod:unmarked",
	/** Old French */
	"nsubj:advmod",
	/** Tagalog */
	"nsubj:bfoc",
	/** Armenian, Classical Armenian, French, Western Armenian */
	"nsubj:caus",
	/** Latin */
	"nsubj:cleft",
	/** Apurina, Breton, Erzya, Estonian, Finnish, Hebrew, Karelian, Komi Permyak, Komi Zyrian, Livvi, Moksha, Sanskrit, Skolt Sami, Turkish, Veps */
	"nsubj:cop",
	/** Tagalog */
	"nsubj:ifoc",
	/** Tagalog */
	"nsubj:lfoc",
	/** Hungarian */
	"nsubj:lvc",
	/** Persian, Tamil, Telugu */
	"nsubj:nc",
	/** Vietnamese */
	"nsubj:nn",
	/** Old French */
	"nsubj:obj",
	/** Abkhaz, Albanian, Ancient Greek, Ancient Hebrew, Azerbaijani, Basque, Beja, Belarusian, Bulgarian, Catalan, Chinese, Classical Chinese, Danish, Dutch, Egyptian, English, Finnish, French, Georgian, German, Gheg, Gothic, Greek, Hebrew, Ika, Irish, Italian, Japanese, Javanese, Khoekhoe, Kyrgyz, Latin, Lithuanian, Naga, Naija, Norwegian, Occitan, Old Church Slavonic, Old East Slavic, Old French, Old Irish, Pesh, Portuguese, Russian, Scottish Gaelic, Spanish, Swedish, Turkish, Turkish German, Ukrainian, Vietnamese */
	"nsubj:outer",
	/** Afrikaans, Albanian, Alemannic, Amharic, Ancient Greek, Arabic, Armenian, Assyrian, Bavarian, Belarusian, Bengali, Bokota, Bulgarian, Buryat, Cantonese, Cappadocian, Catalan, Chinese, Classical Armenian, Classical Chinese, Czech, Dutch, Egyptian, English, Esperanto, Faroese, French, Frisian Dutch, Galician, Georgian, German, Gothic, Greek, Gujarati, Hebrew, Hindi, Indonesian, Italian, Javanese, Khoekhoe, Korean, Kyrgyz, Latin, Latvian, Lithuanian, Low Saxon, Macedonian, Maltese, Marathi, Moksha, Naga, Norwegian, Old Church Slavonic, Old East Slavic, Old English, Ottoman Turkish, Pashto, Paumari, Persian, Pesh, Polish, Pomak, Portuguese, Romanian, Russian, Sanskrit, Scottish Gaelic, Sindhi, Skolt Sami, Slovak, Spanish, Swedish, Tagalog, Tamil, Thai, Tswana, Turkish, Turkish German, Ukrainian, Upper Sorbian, Uyghur, Uzbek, Vietnamese, Western Armenian, Xibe */
	"nsubj:pass",
	/** Cantonese */
	"nsubj:periph",
	/** Vietnamese */
	"nsubj:xsubj",
	/** Vietnamese */
	"nummod:det",
	/** Russian */
	"nummod:entity",
	/** Polish */
	"nummod:flat",
	/** Belarusian, Croatian, Czech, Lithuanian, Old East Slavic, Polish, Russian, Sanskrit, Serbian, Ukrainian, Upper Sorbian */
	"nummod:gov",
	/** Old French */
	"obj:advmod",
	/** Old French */
	"obj:advneg",
	/** Apurina, French, Tagalog */
	"obj:agent",
	/** Khoekhoe, Wolof */
	"obj:appl",
	/** Wolof */
	"obj:caus",
	/** Abkhaz */
	"obj:cs",
	/** Old Irish */
	"obj:infx",
	/** Abkhaz */
	"obj:lo",
	/** French, Hungarian, Naija */
	"obj:lvc",
	/** Old French */
	"obj:obl",
	/** Cantonese, Chinese */
	"obj:periph",
	/** Abkhaz */
	"obj:po",
	/** Abkhaz */
	"obj:poss",
	/** Abkhaz */
	"obj:ro",
	/** Vietnamese */
	"obl:about",
	/** Vietnamese */
	"obl:adj",
	/** Vietnamese */
	"obl:adv",
	/** Middle French, Old French */
	"obl:advmod",
	/** Albanian, Ancient Greek, Armenian, Bavarian, Belarusian, Breton, Cantonese, Catalan, Chinese, Classical Armenian, Czech, Dutch, Egyptian, English, Erzya, Estonian, Finnish, French, Georgian, German, Gothic, Greek, Gujarati, Hindi, Indonesian, Italian, Javanese, Khoekhoe, Komi Zyrian, Latin, Lithuanian, Low Saxon, Maltese, Moksha, Naija, Old Church Slavonic, Old East Slavic, Old Irish, Ottoman Turkish, Pashto, Paumari, Polish, Pomak, Portuguese, Romanian, Russian, Sanskrit, Scottish Gaelic, Skolt Sami, Spanish, Swedish, Tamil, Tswana, Turkish, Ukrainian, Vietnamese, Welsh, Western Armenian */
	"obl:agent",
	/** Wolof */
	"obl:appl",
	/** Ancient Greek, Arabic, Bavarian, Beja, Bokota, Catalan, Chinese, Classical Armenian, Czech, Dutch, Egyptian, French, German, Gothic, Greek, Haitian Creole, Hausa, Icelandic, Ika, Italian, Latin, Lithuanian, Low Saxon, Maltese, Naija, Nenets, Northwest Gbaya, Old Church Slavonic, Old East Slavic, Pashto, Persian, Pesh, Polish, Pomak, Portuguese, Sanskrit, Slovak, South Levantine Arabic, Spanish, Tamil, Ukrainian, Zaar */
	"obl:arg",
	/** Sanskrit */
	"obl:benef",
	/** Kyrgyz, Telugu */
	"obl:cau",
	/** Erzya, Komi Zyrian, Latin, Moksha, Telugu */
	"obl:cmp",
	/** Polish, Tamil */
	"obl:cmpr",
	/** Vietnamese */
	"obl:comp",
	/** Kurmanji */
	"obl:dat",
	/** Belarusian, Old East Slavic, Russian */
	"obl:depict",
	/** Georgian */
	"obl:final",
	/** Belarusian, Old East Slavic, Russian */
	"obl:float",
	/** Sanskrit */
	"obl:goal",
	/** Sanskrit */
	"obl:grad",
	/** Tamil */
	"obl:inst",
	/** Sanskrit */
	"obl:instr",
	/** Georgian, Vietnamese */
	"obl:iobj",
	/** Apurina, Bokota, Chinese, Classical Chinese, Danish, Ika, Italian, Latin, Pesh, Pomak, Sanskrit, Sinhala, Tamil, Tswana, Xibe */
	"obl:lmod",
	/** Hungarian */
	"obl:lvc",
	/** Sanskrit */
	"obl:manner",
	/** Beja, Bokota, French, Haitian Creole, Naija, Nenets, Northwest Gbaya, Pesh, Yupik */
	"obl:mod",
	/** Ancient Hebrew, English */
	"obl:npmod",
	/** Guarani */
	"obl:obj",
	/** Polish */
	"obl:orphan",
	/** Erzya, Kazakh */
	"obl:own",
	/** Sanskrit */
	"obl:path",
	/** Cantonese, Chinese */
	"obl:patient",
	/** Romanian, Tamil */
	"obl:pmod",
	/** Thai */
	"obl:poss",
	/** Irish, Old Irish */
	"obl:prep",
	/** Old East Slavic, Russian */
	"obl:pronmod",
	/** Mbya Guarani */
	"obl:sentcon",
	/** Sanskrit */
	"obl:soc",
	/** Sanskrit */
	"obl:source",
	/** Guajajara, Guarani */
	"obl:subj",
	/** Albanian, Ancient Greek, Apurina, Arabic, Belarusian, Bokota, Cantonese, Chinese, Classical Chinese, Danish, English, Erzya, Frisian Dutch, Georgian, German, Gujarati, Hindi, Ika, Indonesian, Irish, Italian, Javanese, Korean, Kyrgyz, Latin, Manx, Moksha, Old East Slavic, Old Irish, Ottoman Turkish, Pesh, Pomak, Portuguese, Romanian, Russian, Sanskrit, Sinhala, Skolt Sami, Spanish, Tamil, Telugu, Thai, Tswana, Turkish, Uyghur, Vietnamese, Warlpiri, Xibe */
	"obl:tmod",
	/** Coptic, English, Hebrew, Old English, Scottish Gaelic */
	"obl:unmarked",
	/** Vietnamese */
	"obl:with",
	/** Latin */
	"orphan:missing",
	/** Pashto */
	"orphan:nsubjobj",
	/** Pashto */
	"orphan:objobl",
	/** Italian */
	"parataxis:appos",
	/** Naija */
	"parataxis:conj",
	/** Belarusian, Italian, Naija, Old East Slavic, Russian, Slovenian, Turkish German, Ukrainian */
	"parataxis:discourse",
	/** Naija */
	"parataxis:dislocated",
	/** Irish, Italian */
	"parataxis:hashtag",
	/** Beja, French, Haitian Creole, Italian, Polish */
	"parataxis:insert",
	/** Beja, Naija */
	"parataxis:mod",
	/** Ukrainian */
	"parataxis:newsent",
	/** Italian */
	"parataxis:nsubj",
	/** Bambara, Italian, Polish */
	"parataxis:obj",
	/** Beja, French, Hausa, Naija, Northwest Gbaya */
	"parataxis:parenth",
	/** Ukrainian */
	"parataxis:rel",
	/** Chukchi, Latin, Mbya Guarani */
	"parataxis:rep",
	/** Latin */
	"parataxis:reporting",
	/** Slovenian */
	"parataxis:restart",
	/** Irish */
	"parataxis:rt",
	/** Irish */
	"parataxis:sentence",
	/** Turkish German */
	"parataxis:trans",
	/** Irish */
	"parataxis:url",
	/** Ukrainian */
	"vocative:cl",
	/** Irish, Italian, Romanian */
	"vocative:mention",
	/** Vietnamese */
	"xcomp:adj",
	/** Polish */
	"xcomp:cleft",
	/** Vietnamese */
	"xcomp:dir",
	/** Erzya, Finnish, Karelian, Komi Permyak, Livvi */
	"xcomp:ds",
	/** Abkhaz */
	"xcomp:lo",
	/** North Sami, Polish */
	"xcomp:obj",
	/** Irish, Manx, North Sami, Polish, Scottish Gaelic, Ukrainian */
	"xcomp:pred",
	/** Latin */
	"xcomp:relcl",
	/** Sanskrit */
	"xcomp:result",
	/** Abkhaz, Polish */
	"xcomp:subj",
	/** Vietnamese */
	"xcomp:vcomp",
] as const;

export type Deprel =
	| (typeof deprels)[number]
	| (typeof deprelSubtypes)[number]
	// Hack to preserve subtypes autocompletion.
	| (`${(typeof deprels)[number]}:${string}` & Record<string, never>);
