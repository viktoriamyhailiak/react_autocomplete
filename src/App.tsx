import React, { useCallback, useMemo, useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [people, setPeople] = useState(peopleFromServer);
  const [selected, setSelected] = useState<Person | null>(null);
  const [isInputActive, setIsInputActive] = useState(false);
  const { name, born, died } =
    peopleFromServer.find(x => x.name === selected?.name) ||
    peopleFromServer[0];

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const filteredArray = useMemo(() => {
    return people.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery, people]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    applyQuery(e.target.value);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {selected && selected.name === query ? (
          <h1 className="title" data-cy="title">
            {`${name} (${born} - ${died})`}
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        )}

        <div className={classNames('dropdown', { 'is-active': isInputActive })}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleInputChange}
              onClick={() => setIsInputActive(true)}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredArray.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.name}
                  onClick={() => {
                    setQuery(person.name);
                    setSelected(person);
                    setIsInputActive(false);
                  }}
                >
                  <p
                    className={classNames({
                      'has-text-danger': person.sex === 'f',
                      'has-text-link': person.sex === 'm',
                    })}
                  >
                    {person.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {filteredArray.length === 0 && (
          <div
            className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </main>
    </div>
  );
};
