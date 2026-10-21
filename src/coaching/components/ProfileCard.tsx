import portraitDark from '../../assets/portrait-dark.webp';
import portraitLight from '../../assets/portrait-light.webp';
import { CheckIcon } from '../../components/Icons';
import { PROFILE } from '../data/profile';

/** Name, headline and stats at the top of the booking page. */
export function ProfileCard() {
  return (
    <div className="bk-profile">
      <div className="bk-avatar" aria-hidden="true">
        <img className="bk-avatar-dark" src={portraitDark} alt="" width={88} height={88} />
        <img className="bk-avatar-light" src={portraitLight} alt="" width={88} height={88} />
      </div>
      <div className="bk-profile-text">
        <p className="bk-profile-name">{PROFILE.name}</p>
        <ul className="bk-headline" aria-label="Background">
          {PROFILE.headline.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </div>
      <div className="bk-profile-stats">
        <dl>
          {PROFILE.stats.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
        <p>
          On {PROFILE.statsSource}, as of {PROFILE.statsAsOf}
        </p>
      </div>
    </div>
  );
}

/** "About me" section shown below the booking panel. */
export function AboutMe() {
  const a = PROFILE.about;
  return (
    <section className="bk-about bk-about-me" aria-labelledby="bk-about-me">
      <h3 id="bk-about-me">About me</h3>
      <p className="bk-about-lead">{a.lead}</p>
      <p>{a.body}</p>
      <p>{a.listIntro}</p>
      <ul>
        {a.list.map((item) => (
          <li key={item}>
            <span className="bk-tick" aria-hidden="true">
              <CheckIcon size={14} strokeWidth={2.6} />
            </span>
            {item}
          </li>
        ))}
      </ul>
      <p>{a.closing}</p>
    </section>
  );
}
